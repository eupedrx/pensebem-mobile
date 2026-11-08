import { View } from 'react-native';
import type { Program } from '../../data/books';
import { colors } from '../../theme/colors';
import { layout as s } from '../../theme/layout';
import { Body, Button, Label, Panel, Title } from '../ui';

export function ProgramCard({
  program,
  best,
  selected,
  onPlay,
}: {
  program: Program;
  best: number;
  selected: boolean;
  onPlay: () => void;
}) {
  const available = program.questions.length > 0;
  return (
    <Panel style={selected ? { borderColor: colors.yellow, borderWidth: 2 } : undefined}>
      <View style={s.row}>
        <Title style={{ fontSize: 22 }}>Programa {program.number}</Title>
        <Label style={{ color: available ? colors.green : colors.muted }}>
          CÓDIGO {program.code}
        </Label>
      </View>
      <Body>
        {available
          ? `${program.questions.length} questões · Melhor resultado: ${best}/${program.questions.length}`
          : program.number === 6
            ? 'Revisão geral do livro. Depende da digitalização dos programas anteriores.'
            : 'As questões deste programa ainda não foram digitalizadas.'}
      </Body>
      {selected && (
        <Label style={{ color: available ? colors.green : colors.amber }}>
          CÓDIGO RECONHECIDO{available ? '' : ' · CONTEÚDO AINDA INDISPONÍVEL'}
        </Label>
      )}
      <Button disabled={!available} onPress={onPlay}>
        {available ? `Jogar Programa ${program.number}` : 'Aguardando digitalização'}
      </Button>
    </Panel>
  );
}
