import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useProgress } from '../game/store';
import { answerSession, finishSession } from '../game/engine';
import { questions } from '../data/questions';

export function useGameSession() {
  const { progress, update, bookAccess } = useProgress();
  const session = progress.session;
  const [choice, setChoice] = useState<number | null>(null);
  const locked = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const index = session?.attempts.length ?? 0;
  const question = questions.find((q) => q.id === session?.ids[index]);
  useEffect(() => {
    locked.current = false;
  }, [index]);
  useFocusEffect(
    useCallback(() => {
      const listener = BackHandler.addEventListener('hardwareBackPress', () => {
        setLeaving(true);
        return true;
      });
      return () => listener.remove();
    }, []),
  );
  function advance() {
    if (locked.current || choice === null || !session) return;
    locked.current = true;
    const next = answerSession(session, choice);
    update((p) => ({ ...p, session: next }));
    setChoice(null);
  }
  function finish() {
    if (!session || locked.current) return;
    locked.current = true;
    const result = finishSession(session);
    update((p) => ({ version: 1, history: [result, ...p.history].slice(0, 100), session: null }));
    router.replace({ pathname: '/result', params: { id: result.id } });
  }
  return {
    session,
    bookAccess,
    question,
    index,
    choice,
    setChoice,
    leaving,
    setLeaving,
    advance,
    finish,
  };
}
