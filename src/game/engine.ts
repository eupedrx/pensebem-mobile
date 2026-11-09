import { defaultBookId, getProgram } from '../data/books.ts';

export type Mode = 'classic' | 'quick' | 'review';
// Uma entrada por questão concluída; choices guarda todas as tentativas da questão.
export type Attempt = {
  questionId: number;
  choice: number;
  correct: boolean;
  choices: number[];
  points: number;
};
export type Session = {
  bookId: string;
  programNumber: number;
  mode: Mode;
  ids: number[];
  attempts: Attempt[];
  pendingChoices: number[];
  startedAt: string;
};
export type Result = {
  bookId: string;
  programNumber: number;
  id: string;
  mode: Mode;
  total: number;
  score: number;
  maxScore: number;
  scoring: 'legacy' | 'three-attempts';
  attempts: Attempt[];
  date: string;
};
export type Progress = { version: 2; history: Result[]; session: Session | null };
export const emptyProgress = (): Progress => ({ version: 2, history: [], session: null });
export const sessionScore = (session: Session): number =>
  session.attempts.reduce((sum, a) => sum + a.points, 0);

export function reviewIds(history: Result[], bookId = defaultBookId, programNumber = 1): number[] {
  const latest = new Map<number, boolean>();
  for (const result of [...history].reverse()) {
    if (result.bookId !== bookId || result.programNumber !== programNumber) continue;
    for (const attempt of result.attempts) latest.set(attempt.questionId, attempt.correct);
  }
  return (getProgram(bookId, programNumber)?.questions ?? [])
    .filter((q) => latest.get(q.id) === false)
    .map((q) => q.id);
}

export function startSession(
  mode: Mode,
  history: Result[],
  random = Math.random,
  bookId = defaultBookId,
  programNumber = 1,
): Session {
  const program = getProgram(bookId, programNumber);
  if (!program?.questions.length) throw new Error('Este programa ainda não está disponível.');
  const ids =
    mode === 'review'
      ? reviewIds(history, bookId, programNumber)
      : program.questions.map((q) => q.id);
  if (mode === 'quick') {
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
  }
  return {
    bookId,
    programNumber,
    mode,
    ids: mode === 'quick' ? ids.slice(0, 6) : ids,
    attempts: [],
    pendingChoices: [],
    startedAt: new Date().toISOString(),
  };
}

export function answerSession(session: Session, choice: number): Session {
  if (!validChoice(choice)) return session;
  const question = getProgram(session.bookId, session.programNumber)?.questions.find(
    (q) => q.id === session.ids[session.attempts.length],
  );
  if (!question) return session;
  const choices = [...session.pendingChoices, choice];
  const correct = question.answer === choice;
  if (!correct && choices.length < 3) return { ...session, pendingChoices: choices };
  return {
    ...session,
    pendingChoices: [],
    attempts: [
      ...session.attempts,
      {
        questionId: question.id,
        choice,
        correct,
        choices,
        points: correct ? 4 - choices.length : 0,
      },
    ],
  };
}

export function finishSession(session: Session): Result {
  if (
    !session.ids.length ||
    session.attempts.length !== session.ids.length ||
    session.pendingChoices.length
  )
    throw new Error('Sessão incompleta');
  return {
    bookId: session.bookId,
    programNumber: session.programNumber,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    mode: session.mode,
    total: session.ids.length,
    score: sessionScore(session),
    maxScore: session.ids.length * 3,
    scoring: 'three-attempts',
    attempts: session.attempts,
    date: new Date().toISOString(),
  };
}

function validChoice(choice: unknown): choice is number {
  return typeof choice === 'number' && Number.isInteger(choice) && choice >= 0 && choice <= 3;
}
function validMode(mode: unknown): mode is Mode {
  return mode === 'classic' || mode === 'quick' || mode === 'review';
}
function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function validDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function readAttempts(
  value: unknown,
  bookId: string,
  programNumber: number,
  migrate: boolean,
  legacyScore: boolean,
): Attempt[] | null {
  const program = getProgram(bookId, programNumber);
  if (!Array.isArray(value) || !program?.questions.length) return null;
  const attempts: Attempt[] = [];
  for (const item of value) {
    if (!record(item) || !validChoice(item.choice)) return null;
    const q = program.questions.find((q) => q.id === item.questionId);
    if (
      !q ||
      item.correct !== (q.answer === item.choice) ||
      attempts.some((a) => a.questionId === q.id)
    )
      return null;
    // Históricos antigos mantêm seus pontos. Em partidas antigas em andamento,
    // acertos equivalem à primeira tentativa e erros concluídos não são reabertos.
    const choices = migrate
      ? legacyScore || item.correct
        ? [item.choice]
        : [item.choice, item.choice, item.choice]
      : item.choices;
    const points = migrate ? (item.correct ? (legacyScore ? 1 : 3) : 0) : item.points;
    if (
      !Array.isArray(choices) ||
      !choices.length ||
      choices.length > 3 ||
      !choices.every(validChoice) ||
      choices.at(-1) !== item.choice
    )
      return null;
    if (legacyScore) {
      if (choices.length !== 1 || points !== (item.correct ? 1 : 0)) return null;
    } else {
      if (
        choices.slice(0, -1).some((choice) => choice === q.answer) ||
        (!item.correct && choices.length !== 3) ||
        points !== (item.correct ? 4 - choices.length : 0)
      )
        return null;
    }
    attempts.push({
      questionId: q.id,
      choice: item.choice,
      correct: item.correct as boolean,
      choices,
      points: points as number,
    });
  }
  return attempts;
}

function readResult(value: unknown, migrate: boolean): Result | null {
  if (!record(value)) return null;
  const bookId = value.bookId ?? defaultBookId;
  const programNumber = value.programNumber ?? 1;
  if (
    typeof bookId !== 'string' ||
    typeof programNumber !== 'number' ||
    typeof value.id !== 'string' ||
    !validMode(value.mode) ||
    !validDate(value.date)
  )
    return null;
  const scoring = migrate ? 'legacy' : value.scoring;
  if (scoring !== 'legacy' && scoring !== 'three-attempts') return null;
  const attempts = readAttempts(
    value.attempts,
    bookId,
    programNumber,
    migrate,
    scoring === 'legacy',
  );
  if (!attempts?.length || value.total !== attempts.length) return null;
  const maxScore = attempts.length * (scoring === 'legacy' ? 1 : 3);
  if (
    (!migrate && value.maxScore !== maxScore) ||
    value.score !== attempts.reduce((sum, a) => sum + a.points, 0)
  )
    return null;
  return {
    bookId,
    programNumber,
    id: value.id,
    mode: value.mode,
    date: value.date,
    total: attempts.length,
    score: value.score as number,
    maxScore,
    scoring,
    attempts,
  };
}

function readSession(value: unknown, migrate: boolean): Session | null {
  if (!record(value)) return null;
  const bookId = value.bookId ?? defaultBookId;
  const programNumber = value.programNumber ?? 1;
  if (
    typeof bookId !== 'string' ||
    typeof programNumber !== 'number' ||
    !validMode(value.mode) ||
    !validDate(value.startedAt)
  )
    return null;
  const program = getProgram(bookId, programNumber);
  const ids = value.ids;
  const attempts = readAttempts(value.attempts, bookId, programNumber, migrate, false);
  if (
    !program ||
    !Array.isArray(ids) ||
    !ids.length ||
    ids.length > program.questions.length ||
    new Set(ids).size !== ids.length ||
    !ids.every((id) => program.questions.some((q) => q.id === id)) ||
    !attempts ||
    attempts.length > ids.length ||
    attempts.some((a, i) => a.questionId !== ids[i])
  )
    return null;
  const pendingChoices = migrate ? [] : value.pendingChoices;
  const current = program.questions.find((q) => q.id === ids[attempts.length]);
  if (
    !Array.isArray(pendingChoices) ||
    pendingChoices.length > 2 ||
    !pendingChoices.every(validChoice) ||
    (pendingChoices.length &&
      (!current || pendingChoices.some((choice) => choice === current.answer)))
  )
    return null;
  return {
    bookId,
    programNumber,
    mode: value.mode,
    ids,
    attempts,
    pendingChoices,
    startedAt: value.startedAt,
  };
}

export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  try {
    const p: unknown = JSON.parse(raw);
    if (!record(p) || (p.version !== 1 && p.version !== 2) || !Array.isArray(p.history))
      return emptyProgress();
    const migrate = p.version === 1;
    const history = p.history
      .map((value) => readResult(value, migrate))
      .filter((r): r is Result => r !== null)
      .slice(0, 100);
    return { version: 2, history, session: readSession(p.session, migrate) };
  } catch {
    return emptyProgress();
  }
}
