import { AnswerOptions } from '../components/game/AnswerOptions';
import { QuestionDisplay } from '../components/game/QuestionDisplay';
import { useGameSession } from '../hooks/useGameSession';
import { Pressable, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { colors } from '../theme/colors';
import { layout as s } from '../theme/layout';
import { Screen } from '../components/layout/Screen';
import { Body, Button, Label, Panel, Title } from '../components/ui';
import { questions } from '../data/questions';
import { getProgram } from '../data/books';

export default function PlayScreen() {
  const {
    session,
    bookAccess,
    question,
    index,
    choice,
    setChoice,
    leaving,
    setLeaving,
    advance,
    finish,
  } = useGameSession();
  if (!session || bookAccess?.bookId !== session.bookId) return <Redirect href="/" />;
  const score = session.attempts.filter((a) => a.correct).length;
  const last = session.attempts.at(-1);
  return (
    <Screen tabs={false}>
      <View style={s.row}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setLeaving(true)}
          style={{ paddingVertical: 12 }}
        >
          <Label>Sair da partida</Label>
        </Pressable>
        <Label>
          CÓDIGO {getProgram(session.bookId, session.programNumber)?.code} · P
          {session.programNumber}
        </Label>
      </View>
      {leaving ? (
        <Panel>
          <Title style={{ fontSize: 22 }}>Pausar por agora?</Title>
          <Body>Suas respostas ficam salvas para continuar depois.</Body>
          <Button onPress={() => router.replace('/')}>Salvar e sair</Button>
          <Button secondary onPress={() => setLeaving(false)}>
            Continuar jogando
          </Button>
        </Panel>
      ) : (
        <>
          <QuestionDisplay
            index={index}
            total={session.ids.length}
            score={score}
            questionId={question?.id}
          />
          {last && (
            <Panel style={{ padding: 16, borderColor: last.correct ? colors.green : colors.red }}>
              <Label
                style={{ color: last.correct ? colors.green : colors.red }}
                accessibilityLiveRegion="polite"
              >
                {last.correct ? 'RESPOSTA CORRETA' : 'VAMOS APRENDER'}
              </Label>
              <Body>{questions.find((q) => q.id === last.questionId)?.explanation}</Body>
            </Panel>
          )}
          {question ? (
            <>
              <View style={{ gap: 12 }}>
                <Label>HISTÓRIA DE AYRTON SENNA</Label>
                <Title style={{ fontSize: 23, lineHeight: 33 }}>{question.title}</Title>
              </View>
              <AnswerOptions question={question} choice={choice} onSelect={setChoice} />
              <Button disabled={choice === null} onPress={advance}>
                Confirmar resposta
              </Button>
              <Label style={{ textAlign: 'center' }}>
                ADAPTADO DO LIVRO · PÁGINA {question.page}
              </Label>
            </>
          ) : (
            <Panel>
              <Title>Partida concluída!</Title>
              <Body>
                Você respondeu a {session.ids.length}{' '}
                {session.ids.length === 1 ? 'questão' : 'questões'}. Veja o resultado e escolha o
                que revisar.
              </Body>
              <Button onPress={finish}>Ver resultado</Button>
            </Panel>
          )}
        </>
      )}
    </Screen>
  );
}
