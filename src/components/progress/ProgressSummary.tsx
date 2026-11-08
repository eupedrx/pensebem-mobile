import { View } from 'react-native';
import { colors } from '../../theme/colors';
import { layout as s } from '../../theme/layout';
import { Label, Panel, Title } from '../ui';

export function ProgressSummary({
  games,
  total,
  correct,
}: {
  games: number;
  total: number;
  correct: number;
}) {
  return (
    <View style={s.row}>
      <Panel style={{ flex: 1 }}>
        <Title style={{ color: colors.green }}>{games}</Title>
        <Label>PARTIDAS</Label>
      </Panel>
      <Panel style={{ flex: 1 }}>
        <Title style={{ color: colors.cyan }}>
          {total ? `${Math.round((correct / total) * 100)}%` : '—'}
        </Title>
        <Label>ACERTOS</Label>
      </Panel>
    </View>
  );
}
