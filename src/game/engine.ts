import { defaultBookId, getProgram, type Program } from '../data/books.ts';

export type Mode = 'classic' | 'quick' | 'review';
export type Attempt = { questionId: number; choice: number; correct: boolean };
export type Session = {
  bookId: string;
  programNumber: number;
  mode: Mode;
  ids: number[];
  attempts: Attempt[];
  startedAt: string;
};
export type Result = {
  bookId: string;
  programNumber: number;
  id: string;
  mode: Mode;
  total: number;
  score: number;
  attempts: Attempt[];
  date: string;
};
export type Progress = { version: 1; history: Result[]; session: Session | null };
export const emptyProgress = (): Progress => ({ version: 1, history: [], session: null });

export function reviewIds(history: Result[], bookId = defaultBookId, programNumber = 1): number[] {
  const latest = new Map<number, boolean>();
  for (const result of [...history].reverse()) {
    if (
      (result.bookId ?? defaultBookId) !== bookId ||
      (result.programNumber ?? 1) !== programNumber
    )
      continue;
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
    startedAt: new Date().toISOString(),
  };
}

export function answerSession(session: Session, choice: number): Session {
  if (!Number.isInteger(choice) || choice < 0 || choice > 3) return session;
  const question = getProgram(session.bookId, session.programNumber)?.questions.find(
    (q) => q.id === session.ids[session.attempts.length],
  );
  if (!question) return session;
  return {
    ...session,
    attempts: [
      ...session.attempts,
      { questionId: question.id, choice, correct: question.answer === choice },
    ],
  };
}

export function finishSession(session: Session): Result {
  if (!session.ids.length || session.attempts.length !== session.ids.length)
    throw new Error('Sessão incompleta');
  return {
    bookId: session.bookId,
    programNumber: session.programNumber,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    mode: session.mode,
    total: session.ids.length,
    score: session.attempts.filter((a) => a.correct).length,
    attempts: session.attempts,
    date: new Date().toISOString(),
  };
}

function validAttempt(a: unknown, bookId = defaultBookId, programNumber = 1): a is Attempt {
  if (!a || typeof a !== 'object') return false;
  const v = a as Attempt;
  const q = getProgram(bookId, programNumber)?.questions.find((q) => q.id === v.questionId);
  return (
    !!q &&
    Number.isInteger(v.choice) &&
    v.choice >= 0 &&
    v.choice <= 3 &&
    v.correct === (q.answer === v.choice)
  );
}
function validMode(m: unknown): m is Mode {
  return m === 'classic' || m === 'quick' || m === 'review';
}
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  try {
    const p = JSON.parse(raw);
    if (p.version !== 1 || !Array.isArray(p.history)) return emptyProgress();
    // Migra os dados da primeira versão, que tinha somente o Programa 1.
    p.history = p.history.map(
      (r: Result) =>
        r && { ...r, bookId: r.bookId ?? defaultBookId, programNumber: r.programNumber ?? 1 },
    );
    const history = p.history
      .filter(
        (r: Result) =>
          r &&
          typeof r.id === 'string' &&
          validMode(r.mode) &&
          getProgram(r.bookId, r.programNumber)?.questions.length &&
          Number.isFinite(Date.parse(r.date)) &&
          Array.isArray(r.attempts) &&
          r.attempts.every((a) => validAttempt(a, r.bookId, r.programNumber)) &&
          r.total > 0 &&
          r.total === r.attempts.length &&
          r.score === r.attempts.filter((a) => a.correct).length,
      )
      .slice(0, 100);
    const s = p.session && {
      ...p.session,
      bookId: p.session.bookId ?? defaultBookId,
      programNumber: p.session.programNumber ?? 1,
    };
    const program: Program | undefined = s ? getProgram(s.bookId, s.programNumber) : undefined;
    const session =
      s &&
      program &&
      validMode(s.mode) &&
      Number.isFinite(Date.parse(s.startedAt)) &&
      Array.isArray(s.ids) &&
      s.ids.length > 0 &&
      s.ids.length <= program.questions.length &&
      new Set(s.ids).size === s.ids.length &&
      s.ids.every((id: number) => program.questions.some((q) => q.id === id)) &&
      Array.isArray(s.attempts) &&
      s.attempts.length <= s.ids.length &&
      s.attempts.every(
        (a: Attempt, i: number) =>
          validAttempt(a, s.bookId, s.programNumber) && a.questionId === s.ids[i],
      )
        ? (s as Session)
        : null;
    return { version: 1, history, session };
  } catch {
    return emptyProgress();
  }
}
