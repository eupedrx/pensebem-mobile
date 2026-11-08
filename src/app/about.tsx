import { colors } from '../theme/colors';
import { Screen } from '../components/layout/Screen';
import { Body, Label, Panel, Title } from '../components/ui';
export default function AboutScreen() {
  return (
    <Screen>
      <Label>COMO JOGAR</Label>
      <Title>Quatro alternativas.{'\n'}Uma descoberta.</Title>
      <Panel>
        <Label style={{ color: colors.green }}>01 · ESCOLHA</Label>
        <Body>
          Na biblioteca, digite o código impresso na abertura de um programa: 101 a 106. O prefixo
          10 é um atalho do app para ver todos os programas do Senninha. O acesso aos programas é
          feito somente digitando o código. Escolha um programa disponível e toque em Jogar. Para
          retomar uma partida ou jogar de novo após voltar à biblioteca, digite o código novamente.
        </Body>
      </Panel>
      <Panel>
        <Label style={{ color: colors.cyan }}>02 · RESPONDA</Label>
        <Body>
          Leia a pergunta, selecione A, B, C ou D e toque em Confirmar resposta. Cada acerto vale um
          ponto. Você verá uma explicação após responder.
        </Body>
      </Panel>
      <Panel>
        <Label style={{ color: colors.amber }}>03 · APRENDA</Label>
        <Body>
          Veja suas respostas ao concluir e retome os erros no modo de revisão. Você pode sair
          durante uma partida e continuar depois.
        </Body>
      </Panel>
      <Title style={{ fontSize: 20 }}>Sobre esta versão</Title>
      <Body>
        Projeto independente inspirado no brinquedo Pense Bem, com React Native e Expo. Funciona sem
        conta e sem conexão após a instalação. O progresso fica neste aparelho.
      </Body>
      <Body>
        Conteúdo adaptado do Programa 1, páginas impressas 3 a 7 do livro “Pense Bem — Senninha
        conta a história do Ayrton Senna”, edição de 1995, fornecido para este projeto. Os
        enunciados foram adaptados para uso sem o livro físico; as explicações são editoriais.
      </Body>
      <Body>
        Esta versão avança após cada resposta e oferece revisão dos erros ao final. No brinquedo
        descrito no livro, uma resposta errada repetia a questão. Os seis programas estão
        cadastrados, mas somente o Programa 1 tem questões digitalizadas. Os programas 2 a 6
        aparecem como indisponíveis.
      </Body>
      <Body>
        Os dados históricos são apresentados no contexto do livro. A menção a recordes da publicação
        não representa um recorde atual.
      </Body>
      <Body style={{ fontSize: 11 }}>
        Pense Bem, Tectoy, Senninha e demais marcas e imagens pertencem aos seus respectivos
        titulares. Este projeto não possui vínculo oficial com eles.
      </Body>
    </Screen>
  );
}
