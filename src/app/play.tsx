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
import { sessionScore } from '../game/engine';

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
  const score = sessionScore(session);
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
            attemptNumber={session.pendingChoices.length + 1}
          />
          {session.pendingChoices.length > 0 ? (
            <Panel style={{ borderColor: colors.red }}>
              <Label style={{ color: colors.red }} accessibilityLiveRegion="polite">
                RESPOSTA INCORRETA · TENTE NOVAMENTE
              </Label>
              <Body>
                Você tem {3 - session.pendingChoices.length}{' '}
                {session.pendingChoices.length === 2
                  ? 'tentativa restante'
                  : 'tentativas restantes'}
                . Um acerto agora vale {3 - session.pendingChoices.length}{' '}
                {session.pendingChoices.length === 2 ? 'ponto' : 'pontos'}.
              </Body>
            </Panel>
          ) : (
            last && (
              <Panel style={{ padding: 16, borderColor: last.correct ? colors.green : colors.red }}>
                <Label
                  style={{ color: last.correct ? colors.green : colors.red }}
                  accessibilityLiveRegion="polite"
                >
                  {last.correct
                    ? `RESPOSTA CORRETA · +${last.points} ${last.points === 1 ? 'PONTO' : 'PONTOS'}`
                    : 'TRÊS TENTATIVAS ENCERRADAS · 0 PONTOS'}
                </Label>
                <Body>{questions.find((q) => q.id === last.questionId)?.explanation}</Body>
              </Panel>
            )
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
              <Title style={{ color: colors.green }}>
                Total: {score} de {session.ids.length * 3} pontos
              </Title>
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
