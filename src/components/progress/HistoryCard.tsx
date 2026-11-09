import { View } from 'react-native';
import type { Result } from '../../game/engine';
import { books, getProgram } from '../../data/books';
import { colors } from '../../theme/colors';
import { layout as s } from '../../theme/layout';
import { Body, Button, Label, Panel, Title } from '../ui';

const modeNames = { classic: 'Programa 1', quick: 'Partida rápida', review: 'Revisão de erros' };
export function HistoryCard({
  result: r,
  onViewAnswers,
}: {
  result: Result;
  onViewAnswers: () => void;
}) {
  return (
    <Panel key={r.id}>
      <View style={s.row}>
        <Label>{r.mode === 'classic' ? `Programa ${r.programNumber}` : modeNames[r.mode]}</Label>
        <Title style={{ fontSize: 22, color: colors.green }}>
          {r.score}/{r.maxScore} pts
        </Title>
      </View>
      {r.scoring === 'legacy' && <Label>REGRA ANTERIOR · 1 PONTO POR ACERTO</Label>}
      <Body>
        {books.find((b) => b.id === r.bookId)?.title} · Código{' '}
        {getProgram(r.bookId, r.programNumber)?.code}
      </Body>
      <Body>{new Date(r.date).toLocaleString('pt-BR')}</Body>
      <Button secondary onPress={onViewAnswers}>
        Ver respostas
      </Button>
    </Panel>
  );
}
