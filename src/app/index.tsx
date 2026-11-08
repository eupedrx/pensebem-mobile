import { View } from 'react-native';
import { Body, Label, Panel, Title } from '../components/ui';
import { Screen } from '../components/layout/Screen';
import { BookCodeForm } from '../components/library/BookCodeForm';
import { RegisteredBookCard } from '../components/library/RegisteredBookCard';
import { useProgress } from '../game/store';
import { books } from '../data/books';
import { colors } from '../theme/colors';

export default function LibraryScreen() {
  const { progress } = useProgress();
  return (
    <Screen>
      <View style={{ gap: 10 }}>
        <Label>SUA BIBLIOTECA</Label>
        <Title>Qual livro vamos{'\n'}jogar hoje?</Title>
        <Body>Digite o código e escolha um dos programas do livro.</Body>
      </View>
      <BookCodeForm />
      {progress.session && (
        <Panel style={{ borderColor: colors.amber }}>
          <Label style={{ color: colors.amber }}>PARTIDA SALVA</Label>
          <Body>
            {progress.session.attempts.length} de {progress.session.ids.length} respostas
            registradas. Digite o código do mesmo livro para continuar a partida.
          </Body>
        </Panel>
      )}
      <Title style={{ fontSize: 22 }}>Livros cadastrados</Title>
      {books.map((book) => (
        <RegisteredBookCard key={book.id} book={book} />
      ))}
      <Body style={{ fontSize: 11 }}>
        O prefixo 10 é um atalho deste aplicativo. No livro, os códigos completos identificam os
        programas. Digitar um código só abre conteúdos já cadastrados.
      </Body>
    </Screen>
  );
}
