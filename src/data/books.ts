import { questions, type Question } from './questions.ts';

export type Program = { number: number; code: string; questions: Question[] };
export type Book = { id: string; prefix: string; title: string; programs: Program[] };
export const defaultBookId = 'senninha';
export const books: Book[] = [
  {
    id: defaultBookId,
    prefix: '10',
    title: 'Senninha e a história de Ayrton Senna',
    programs: Array.from({ length: 6 }, (_, index) => ({
      number: index + 1,
      code: `10${index + 1}`,
      questions: index === 0 ? questions : [],
    })),
  },
];

// O prefixo é um atalho do app. Os códigos completos 101–106 estão no PDF.
export function resolveBookCode(value: string): { book: Book; program?: Program } | null {
  const code = value.trim();
  if (!/^\d{2,3}$/.test(code)) return null;
  for (const book of books) {
    if (book.prefix === code) return { book };
    const program = book.programs.find((p) => p.code === code);
    if (program) return { book, program };
  }
  return null;
}
export function getProgram(bookId = defaultBookId, programNumber = 1): Program | undefined {
  return books.find((b) => b.id === bookId)?.programs.find((p) => p.number === programNumber);
}
