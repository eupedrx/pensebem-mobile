import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emptyProgress, parseProgress, type Progress } from './engine';
import { resolveBookCode } from '../data/books';

const KEY = '@pensebem/progress/v1';
const Context = createContext<{
  progress: Progress;
  ready: boolean;
  error: string | null;
  update: (fn: (p: Progress) => Progress) => void;
  bookAccess: { code: string; bookId: string } | null;
  openBook: (code: string) => boolean;
  lockBook: () => void;
}>({
  progress: emptyProgress(),
  ready: false,
  error: null,
  update: () => {},
  bookAccess: null,
  openBook: () => false,
  lockBook: () => {},
});

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  // A liberação existe só em memória e é concedida pelo formulário de código.
  const [bookAccess, setBookAccess] = useState<{ code: string; bookId: string } | null>(null);
  const lockBook = useCallback(() => setBookAccess(null), []);
  const openBook = useCallback((code: string) => {
    const match = resolveBookCode(code);
    if (!match) return false;
    setBookAccess({ code: code.trim(), bookId: match.book.id });
    return true;
  }, []);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (active) setProgress(parseProgress(raw));
      })
      .catch(() => {
        if (active) setError('Não foi possível ler o progresso salvo.');
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!ready || !dirty) return;
    // Escritas em série impedem uma resposta anterior de sobrescrever a mais recente.
    queue.current = queue.current
      .then(() => AsyncStorage.setItem(KEY, JSON.stringify(progress)))
      .then(() => setError(null))
      .catch(() =>
        setError('Não foi possível salvar. Seu progresso está disponível apenas nesta sessão.'),
      );
  }, [progress, ready, dirty]);
  return (
    <Context.Provider
      value={{
        progress,
        ready,
        error,
        bookAccess,
        openBook,
        lockBook,
        update: (fn) => {
          setDirty(true);
          setProgress(fn);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useProgress = () => useContext(Context);
