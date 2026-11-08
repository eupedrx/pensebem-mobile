import { Text } from 'react-native';
import type { Result } from '../../game/engine';
import { colors } from '../../theme/colors';
import { Body, Label, Panel } from '../ui';

export function ScoreSummary({ result }: { result: Result }) {
  return (
    <Panel style={{ alignItems: 'center' }}>
      <Label style={{ color: colors.green }}>SEU RESULTADO</Label>
      <Text
        style={{
          fontFamily: 'SpaceMono_700Bold',
          fontSize: 56,
          color: colors.green,
        }}
      >
        {result.score.toString().padStart(2, '0')}
        <Text style={{ fontSize: 24 }}>/{result.total}</Text>
      </Text>
      <Body>{Math.round((result.score / result.total) * 100)}% de acertos</Body>
    </Panel>
  );
}
