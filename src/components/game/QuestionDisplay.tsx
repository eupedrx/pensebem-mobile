import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { layout as s } from '../../theme/layout';
import { Label, Panel } from '../ui';

export function QuestionDisplay({
  index,
  total,
  score,
  questionId,
}: {
  index: number;
  total: number;
  score: number;
  questionId?: number;
}) {
  return (
    <Panel style={{ minHeight: 140 }}>
      <View style={s.row}>
        <Label style={{ color: colors.cyan }}>
          QUESTÃO{' '}
          {Math.min(index + 1, total)
            .toString()
            .padStart(2, '0')}{' '}
          / {total}
        </Label>
        <Label style={{ color: colors.cyan }}>{score} ACERTOS</Label>
      </View>
      <Text style={local.display}>
        {questionId === undefined ? 'FIM' : questionId.toString().padStart(2, '0')}
      </Text>
      <View style={local.track}>
        <View
          style={{ height: 3, width: `${(index / total) * 100}%`, backgroundColor: colors.cyan }}
        />
      </View>
    </Panel>
  );
}
const local = StyleSheet.create({
  display: {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 52,
    letterSpacing: 8,
    color: colors.cyan,
  },
  track: { height: 3, backgroundColor: colors.bg },
});
