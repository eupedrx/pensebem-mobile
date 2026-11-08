import { ProgressSummary } from '../components/progress/ProgressSummary';
import { HistoryCard } from '../components/progress/HistoryCard';
import { router } from 'expo-router';
import { Screen } from '../components/layout/Screen';
import { Body, Button, Label, Panel, Title } from '../components/ui';
import { useProgress } from '../game/store';
import { reviewIds } from '../game/engine';

export default function ProgressScreen() {
  const { progress } = useProgress();
  const total = progress.history.reduce((v, r) => v + r.total, 0);
  const correct = progress.history.reduce((v, r) => v + r.score, 0);
  return (
    <Screen>
      <Label>NO SEU RITMO</Label>
      <Title>Seu progresso.</Title>
      <ProgressSummary games={progress.history.length} total={total} correct={correct} />
      <Body>
        {reviewIds(progress.history).length} questões para revisar. O histórico guarda as últimas
        100 partidas neste aparelho.
      </Body>
      <Title style={{ fontSize: 20 }}>Últimas partidas</Title>
      {!progress.history.length ? (
        <Panel>
          <Title style={{ fontSize: 20 }}>Seu primeiro passo</Title>
          <Body>Conclua uma partida para acompanhar seus resultados aqui.</Body>
          <Button onPress={() => router.replace('/')}>Escolher uma partida</Button>
        </Panel>
      ) : (
        progress.history.map((result) => (
          <HistoryCard
            key={result.id}
            result={result}
            onViewAnswers={() => router.push({ pathname: '/result', params: { id: result.id } })}
          />
        ))
      )}
    </Screen>
  );
}
