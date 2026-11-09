import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questions } from '../src/data/questions.ts';
import {
  answerSession,
  emptyProgress,
  finishSession,
  parseProgress,
  reviewIds,
  sessionScore,
  startSession,
} from '../src/game/engine.ts';
import { books, resolveBookCode } from '../src/data/books.ts';

const oneQuestion = () => ({ ...startSession('classic', []), ids: [1] });
const wrongChoice = (answer: number) => (answer + 1) % 4;

test('banco tem 30 questões únicas, quatro opções e gabaritos válidos', () => {
  assert.equal(questions.length, 30);
  assert.equal(new Set(questions.map((q) => q.id)).size, 30);
  for (const q of questions) {
    assert.equal(q.options.length, 4);
    assert.ok(q.answer >= 0 && q.answer < 4);
  }
});

for (const tries of [1, 2, 3]) {
  test(`acerto na ${tries}ª tentativa vale ${4 - tries} pontos`, () => {
    let s = oneQuestion();
    for (let i = 1; i < tries; i++) {
      s = answerSession(s, 1);
      assert.equal(s.attempts.length, 0);
      assert.equal(s.pendingChoices.length, i);
      assert.equal(sessionScore(s), 0);
      assert.throws(() => finishSession(s));
    }
    s = answerSession(s, 0);
    const result = finishSession(s);
    assert.equal(result.score, 4 - tries);
    assert.equal(result.maxScore, 3);
    assert.equal(result.attempts[0].choices.length, tries);
    assert.deepEqual(s.pendingChoices, []);
    assert.equal(answerSession(s, 0), s);
  });
}

test('três erros encerram a questão sem pontos e sem permitir uma quarta tentativa', () => {
  let s = oneQuestion();
  for (const choice of [1, 2, 3]) s = answerSession(s, choice);
  assert.equal(finishSession(s).score, 0);
  assert.equal(s.attempts.length, 1);
  assert.deepEqual(s.attempts[0].choices, [1, 2, 3]);
  assert.equal(answerSession(s, 0), s);
});

test('após a terceira falha avança e reinicia as três tentativas da próxima questão', () => {
  let s = startSession('classic', []);
  for (let i = 0; i < 3; i++) s = answerSession(s, 1);
  s = answerSession(s, questions[1].answer);
  assert.equal(s.attempts[1].questionId, questions[1].id);
  assert.equal(s.attempts[1].points, 3);
});

test('30 acertos na primeira tentativa somam 90 pontos', () => {
  let s = startSession('classic', []);
  assert.throws(() => finishSession(s));
  for (const q of questions) s = answerSession(s, q.answer);
  const result = finishSession(s);
  assert.equal(result.total, 30);
  assert.equal(result.score, 90);
  assert.equal(result.maxScore, 90);
});

test('soma corretamente uma partida de 30 perguntas com resultados mistos', () => {
  let s = startSession('classic', []);
  questions.forEach((q, index) => {
    const mistakes = index % 4;
    for (let i = 0; i < mistakes; i++) s = answerSession(s, wrongChoice(q.answer));
    if (mistakes < 3) s = answerSession(s, q.answer);
  });
  assert.equal(finishSession(s).score, 47);
});

test('respostas inválidas não gastam tentativas', () => {
  const s = oneQuestion();
  for (const invalid of [-1, 4, 1.5, NaN]) assert.equal(answerSession(s, invalid), s);
});

test('revisão considera o resultado final da questão, incluindo acerto após erro', () => {
  let s = oneQuestion();
  for (let i = 0; i < 3; i++) s = answerSession(s, 1);
  const wrong = finishSession(s);
  const right = finishSession(answerSession(answerSession(oneQuestion(), 1), 0));
  assert.deepEqual(reviewIds([wrong]), [1]);
  assert.deepEqual(reviewIds([right, wrong]), []);
});

test('partida rápida sorteia seis questões sem repetição e vale até 18 pontos', () => {
  let s = startSession('quick', [], () => 0.5);
  assert.equal(s.ids.length, 6);
  assert.equal(new Set(s.ids).size, 6);
  for (const id of s.ids) s = answerSession(s, questions.find((q) => q.id === id)!.answer);
  assert.equal(finishSession(s).maxScore, 18);
});

test('retoma a mesma questão e as tentativas já usadas após persistência', () => {
  for (const mistakes of [1, 2]) {
    let s = oneQuestion();
    for (let i = 0; i < mistakes; i++) s = answerSession(s, 1);
    const p = { ...emptyProgress(), session: s };
    const restored = parseProgress(JSON.stringify(p));
    assert.deepEqual(restored, p);
    assert.equal(finishSession(answerSession(restored.session!, 0)).score, 3 - mistakes);
  }
});

test('restaura resultado com três tentativas e rejeita pontuação adulterada', () => {
  const result = finishSession(answerSession(answerSession(oneQuestion(), 1), 0));
  const p = { ...emptyProgress(), history: [result] };
  assert.deepEqual(parseProgress(JSON.stringify(p)), p);
  assert.equal(
    parseProgress(JSON.stringify({ ...p, history: [{ ...result, score: 3 }] })).history.length,
    0,
  );
});

test('descarta sessão corrompida, tentativa correta pendente ou mais de duas pendentes', () => {
  assert.deepEqual(parseProgress('{bad'), emptyProgress());
  const p = { ...emptyProgress(), session: oneQuestion() };
  for (const change of [{ ids: [999] }, { pendingChoices: [0] }, { pendingChoices: [1, 2, 3] }]) {
    assert.equal(
      parseProgress(JSON.stringify({ ...p, session: { ...p.session, ...change } })).session,
      null,
    );
  }
});

test('migra o progresso antigo sem apagar histórico ou reabrir questões concluídas', () => {
  const oldAttempts = [
    { questionId: 1, choice: 0, correct: true },
    { questionId: 2, choice: 0, correct: false },
  ];
  const old = {
    version: 1,
    history: [
      {
        id: 'old',
        mode: 'classic',
        total: 2,
        score: 1,
        attempts: oldAttempts,
        date: '2026-11-06T12:00:00Z',
      },
    ],
    session: {
      mode: 'classic',
      ids: [1, 2, 3],
      attempts: oldAttempts,
      startedAt: '2026-11-06T12:00:00Z',
    },
  };
  const p = parseProgress(JSON.stringify(old));
  assert.equal(p.version, 2);
  assert.equal(p.history[0].score, 1);
  assert.equal(p.history[0].maxScore, 2);
  assert.equal(p.history[0].scoring, 'legacy');
  assert.equal(p.session?.attempts.length, 2);
  assert.equal(sessionScore(p.session!), 3);
  assert.deepEqual(p.session?.pendingChoices, []);
  assert.deepEqual(parseProgress(JSON.stringify(p)), p);
});

test('código completo identifica livro e programa; prefixo abre o catálogo', () => {
  assert.equal(resolveBookCode('10')?.book.id, 'senninha');
  assert.equal(resolveBookCode('10')?.program, undefined);
  for (let n = 1; n <= 6; n++) assert.equal(resolveBookCode(` 10${n} `)?.program?.number, n);
  for (const code of ['', '1', '100', '107', '999', '0101', '1e2', '10x'])
    assert.equal(resolveBookCode(code), null);
});

test('programas indisponíveis e livros desconhecidos não iniciam nem restauram partidas', () => {
  assert.equal(books[0].programs.length, 6);
  assert.throws(() => startSession('classic', [], Math.random, 'senninha', 2));
  assert.throws(() => startSession('classic', [], Math.random, 'outro', 1));
  const p = { ...emptyProgress(), session: { ...oneQuestion(), programNumber: 2 } };
  assert.equal(parseProgress(JSON.stringify(p)).session, null);
});
