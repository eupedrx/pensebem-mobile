import { View } from 'react-native';
import type { Attempt } from '../../game/engine';
import type { Question } from '../../data/questions';
import { colors } from '../../theme/colors';
import { Body, Label, Panel } from '../ui';

export function AnswerReviewCard({
  question: q,
  attempt,
}: {
  question: Question;
  attempt: Attempt;
}) {
  return (
    <Panel key={q.id}>
      <Label style={{ color: attempt.correct ? colors.green : colors.red }}>
        QUESTÃO {q.id} · {attempt.correct ? 'ACERTO' : 'REVISAR'}
      </Label>
      <Body style={{ color: colors.text }}>{q.title}</Body>
      <View style={{ gap: 8 }}>
        {attempt.choices.map((choice, index) => (
          <Body key={index}>
            {index + 1}ª tentativa: {q.options[choice]}
          </Body>
        ))}
        <Body>
          {attempt.points} {attempt.points === 1 ? 'ponto obtido' : 'pontos obtidos'}
        </Body>
        {!attempt.correct && (
          <Body style={{ color: colors.green }}>Correta: {q.options[q.answer]}</Body>
        )}
        <Body>{q.explanation}</Body>
      </View>
    </Panel>
  );
}
