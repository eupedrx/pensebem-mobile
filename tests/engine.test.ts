import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questions } from '../src/data/questions.ts';
import { answerSession, emptyProgress, finishSession, parseProgress, reviewIds, startSession } from '../src/game/engine.ts';
import { books, resolveBookCode } from '../src/data/books.ts';

test('banco tem 30 questões únicas, quatro opções e gabaritos válidos', () => {
  assert.equal(questions.length, 30);
  assert.equal(new Set(questions.map(q => q.id)).size, 30);
  for (const q of questions) { assert.equal(q.options.length, 4); assert.ok(q.answer >= 0 && q.answer < 4); }
});
test('pontua cada questão uma vez e impede respostas após a conclusão', () => {
  let s = startSession('classic', []);
  assert.throws(() => finishSession(s));
  for (const q of questions) s = answerSession(s, q.answer);
  assert.equal(finishSession(s).score, 30);
  assert.equal(answerSession(s, 0), s);
  assert.equal(answerSession(startSession('classic', []), -1).attempts.length, 0);
});
test('revisão usa a tentativa mais recente de cada questão', () => {
  const s = { ...startSession('classic', []), ids: [1] };
  const wrong = finishSession(answerSession(s, 1));
  const right = finishSession(answerSession(s, 0));
  assert.deepEqual(reviewIds([wrong]), [1]);
  assert.deepEqual(reviewIds([right, wrong]), []);
});
test('partida rápida sorteia seis questões sem repetição', () => {
  const s = startSession('quick', [], () => 0.5);
  assert.equal(s.ids.length, 6);
  assert.equal(new Set(s.ids).size, 6);
});
test('restaura sessão e descarta dados corrompidos', () => {
  const p = { ...emptyProgress(), session: answerSession(startSession('classic', []), 0) };
  assert.deepEqual(parseProgress(JSON.stringify(p)), p);
  assert.deepEqual(parseProgress('{bad'), emptyProgress());
  assert.equal(parseProgress(JSON.stringify({ ...p, session: { ...p.session, ids: [999] } })).session, null);
});

test('código completo identifica o livro e o programa; prefixo abre o catálogo', () => {
  assert.equal(resolveBookCode('10')?.book.id, 'senninha');
  assert.equal(resolveBookCode('10')?.program, undefined);
  for (let n = 1; n <= 6; n++) assert.equal(resolveBookCode(` 10${n} `)?.program?.number, n);
  for (const code of ['', '1', '100', '107', '999', '0101', '1e2', '10x']) assert.equal(resolveBookCode(code), null);
});

test('programas sem questões e livros desconhecidos não iniciam partidas', () => {
  assert.equal(books[0].programs.length, 6);
  assert.throws(() => startSession('classic', [], Math.random, 'senninha', 2));
  assert.throws(() => startSession('classic', [], Math.random, 'outro', 1));
  assert.equal(startSession('classic', []).bookId, 'senninha');
});

test('migração mantém histórico e sessão anteriores à identificação de livro', () => {
  const session = answerSession(startSession('classic', []), 0);
  let complete = startSession('quick', [], () => 0.5);
  for (const id of complete.ids) complete = answerSession(complete, questions.find(q => q.id === id)!.answer);
  const result = finishSession(complete);
  const legacy = (value: object) => Object.fromEntries(Object.entries(value).filter(([key]) => !['bookId', 'programNumber'].includes(key)));
  const restored = parseProgress(JSON.stringify({ version: 1, history: [legacy(result)], session: legacy(session) }));
  assert.deepEqual(restored, { version: 1, history: [result], session });
});

test('sessões adulteradas não usam questões em um programa indisponível', () => {
  const session = startSession('classic', []);
  const restored = parseProgress(JSON.stringify({ version: 1, history: [], session: { ...session, programNumber: 2 } }));
  assert.equal(restored.session, null);
});
