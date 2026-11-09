import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { layout as s } from '../../theme/layout';
import { Label, Panel } from '../ui';

export function QuestionDisplay({
  index,
  total,
  score,
  questionId,
  attemptNumber,
}: {
  index: number;
  total: number;
  score: number;
  questionId?: number;
  attemptNumber: number;
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
        <Label style={{ color: colors.cyan }}>{score} PONTOS</Label>
      </View>
      <Text style={local.display}>
        {questionId === undefined ? 'FIM' : questionId.toString().padStart(2, '0')}
      </Text>
      {questionId !== undefined && (
        <Label>
          TENTATIVA {attemptNumber} DE 3 · VALE {4 - attemptNumber}{' '}
          {attemptNumber === 3 ? 'PONTO' : 'PONTOS'}
        </Label>
      )}
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
