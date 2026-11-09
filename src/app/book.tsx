import { ProgramCard } from '../components/books/ProgramCard';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Image } from 'react-native';
import { colors } from '../theme/colors';
import { Screen } from '../components/layout/Screen';
import { Body, Button, Label, Panel, Title } from '../components/ui';
import { resolveBookCode } from '../data/books';
import { useProgress } from '../game/store';
import { reviewIds, startSession, type Mode } from '../game/engine';

export default function BookScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const match = resolveBookCode(typeof code === 'string' ? code : '');
  const { progress, update, bookAccess } = useProgress();
  if (!bookAccess || bookAccess.code !== code) return <Redirect href="/" />;
  if (!match)
    return (
      <Screen>
        <Title>Livro não encontrado</Title>
        <Body>Volte à biblioteca e digite um código cadastrado.</Body>
        <Button onPress={() => router.replace('/')}>Voltar à biblioteca</Button>
      </Screen>
    );
  const { book, program: requested } = match;
  const errors = reviewIds(progress.history, book.id).length;
  function start(number: number, mode: Mode = 'classic') {
    update((p) => ({ ...p, session: startSession(mode, p.history, Math.random, book.id, number) }));
    router.push('/play');
  }
  return (
    <Screen>
      <Button secondary onPress={() => router.replace('/')}>
        Trocar livro ou código
      </Button>
      <Label>PROGRAMAÇÃO DO LIVRO · PREFIXO {book.prefix}</Label>
      <Image
        source={require('../../assets/book-cover.jpg')}
        accessibilityLabel={`Capa do livro ${book.title}`}
        resizeMode="contain"
        style={{ width: 160, height: 208, borderRadius: 3, alignSelf: 'center' }}
      />
      <Title>{book.title}</Title>
      <Body>
        Escolha um programa abaixo. Os códigos são os mesmos impressos nas páginas de abertura do
        livro.
      </Body>
      {progress.session && (
        <Panel style={{ borderColor: colors.amber }}>
          <Body>
            Há uma partida em andamento. Iniciar outra substitui essa partida; o histórico de
            partidas concluídas permanece salvo.
          </Body>
          {progress.session.bookId === book.id && (
            <Button secondary onPress={() => router.push('/play')}>
              Continuar partida
            </Button>
          )}
        </Panel>
      )}
      {book.programs.map((program) => {
        const best = progress.history
          .filter(
            (r) =>
              r.bookId === book.id &&
              r.programNumber === program.number &&
              r.mode === 'classic' &&
              r.scoring === 'three-attempts',
          )
          .reduce((value, r) => Math.max(value, r.score), 0);
        return (
          <ProgramCard
            key={program.code}
            program={program}
            best={best}
            selected={requested?.number === program.number}
            onPlay={() => start(program.number)}
          />
        );
      })}
      <Title style={{ fontSize: 20 }}>Outras formas de jogar</Title>
      <Panel>
        <Label style={{ color: colors.cyan }}>PARTIDA RÁPIDA · PROGRAMA 1</Label>
        <Body>
          Seis questões sorteadas entre as questões digitalizadas do Programa 1. Este modo é uma
          opção do app e não corresponde ao Programa 6 do livro.
        </Body>
        <Button secondary onPress={() => start(1, 'quick')}>
          Jogar partida rápida
        </Button>
      </Panel>
      <Panel>
        <Label style={{ color: colors.amber }}>REVISAR ERROS · PROGRAMA 1</Label>
        <Body>
          {errors} {errors === 1 ? 'questão para revisar' : 'questões para revisar'} neste livro.
        </Body>
        <Button secondary disabled={!errors} onPress={() => start(1, 'review')}>
          Revisar questões
        </Button>
      </Panel>
    </Screen>
  );
}
