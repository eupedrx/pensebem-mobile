import { ScoreSummary } from '../components/results/ScoreSummary';
import { AnswerReviewCard } from '../components/results/AnswerReviewCard';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '../components/layout/Screen';
import { Button, Label, Title } from '../components/ui';
import { useProgress } from '../game/store';
import { questions } from '../data/questions';

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { progress } = useProgress();
  const result = progress.history.find((r) => r.id === id);
  if (!result)
    return (
      <Screen>
        <Title>Resultado indisponível</Title>
        <Button onPress={() => router.replace('/')}>Voltar à biblioteca</Button>
      </Screen>
    );
  return (
    <Screen>
      <Label>PARTIDA CONCLUÍDA</Label>
      <Title>
        {result.attempts.every((a) => a.correct) ? 'Você acertou todas!' : 'Cada resposta ensina.'}
      </Title>
      <ScoreSummary result={result} />
      <Button onPress={() => router.replace('/')}>Digitar código para jogar</Button>
      <Title style={{ fontSize: 20 }}>Suas respostas</Title>
      {result.attempts.map((attempt) => (
        <AnswerReviewCard
          key={attempt.questionId}
          question={questions.find((q) => q.id === attempt.questionId)!}
          attempt={attempt}
        />
      ))}
    </Screen>
  );
}
