import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Question } from '../../data/questions';
import { colors } from '../../theme/colors';
import { Body } from '../ui';

const accents = [colors.red, colors.yellow, colors.cyan, colors.green];
export function AnswerOptions({
  question,
  choice,
  onSelect,
}: {
  question: Question;
  choice: number | null;
  onSelect: (choice: number) => void;
}) {
  return (
    <View style={{ gap: 10 }}>
      {question.options.map((option, i) => (
        <Pressable
          key={`${question.id}-${i}`}
          accessibilityRole="radio"
          accessibilityState={{ selected: choice === i }}
          accessibilityLabel={`${'ABCD'[i]}. ${option}`}
          onPress={() => onSelect(i)}
          style={({ pressed }) => [
            local.option,
            choice === i && { borderColor: colors.cyan, backgroundColor: colors.panel },
            pressed && { opacity: 0.7 },
          ]}
        >
          <View style={[local.key, { backgroundColor: accents[i] }]}>
            <Text style={[local.keyText, { color: i === 1 ? colors.text : colors.onKey }]}>{'ABCD'[i]}</Text>
          </View>
          <Body style={{ color: colors.text, flex: 1 }}>{option}</Body>
        </Pressable>
      ))}
    </View>
  );
}
const local = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 70,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 9,
    backgroundColor: colors.panel,
  },
  key: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  keyText: { fontFamily: 'SpaceMono_700Bold', fontSize: 22, color: colors.bg },
});
