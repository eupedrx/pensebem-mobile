import { Image, View } from 'react-native';
import type { Book } from '../../data/books';
import { colors } from '../../theme/colors';
import { Body, Label, Panel, Title } from '../ui';

export function RegisteredBookCard({ book }: { book: Book }) {
  return (
    <Panel>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
        <View style={{ flex: 1, gap: 12 }}>
          <Label>NOME DO LIVRO</Label>
          <Title style={{ fontSize: 21, lineHeight: 30 }}>{book.title}</Title>
        </View>
        <Image
          source={require('../../../assets/book-cover.jpg')}
          accessibilityLabel={`Capa do livro ${book.title}`}
          style={{ width: 80, height: 104, borderRadius: 3 }}
        />
      </View>
      <View style={{ gap: 6 }}>
        <Label style={{ color: colors.cyan }}>CÓDIGO DO LIVRO NO APP</Label>
        <Title style={{ color: colors.cyan, fontSize: 34 }}>{book.prefix}</Title>
      </View>
      <Body>Códigos dos programas: {book.programs.map((program) => program.code).join(', ')}.</Body>
      <Body>
        {book.programs.length} programas cadastrados ·{' '}
        {book.programs.filter((program) => program.questions.length).length} disponível para jogar.
      </Body>
      <Body style={{ color: colors.text }}>
        Para acessar, digite o código do livro no campo acima.
      </Body>
    </Panel>
  );
}
