import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useProgress } from '../game/store';

export function useBookCode() {
  const { openBook, lockBook } = useProgress();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      lockBook();
    }, [lockBook]),
  );

  function changeCode(value: string) {
    setCode(value);
    setError('');
  }

  function submit() {
    if (!openBook(code)) {
      setError('Código não encontrado. Confira o código impresso no seu livro.');
      return;
    }
    setError('');
    router.push({ pathname: '/book', params: { code: code.trim() } });
  }

  return { code, error, changeCode, submit };
}
