# Pense Bem mobile

Aplicativo em React Native, TypeScript e Expo SDK 58 para Android e iOS, com prévia web. Projeto independente inspirado no Pense Bem.

## Executar

Requer Node.js compatível com o Expo SDK 58 e npm.

```sh
npm ci
npm start
```

Abra no Expo Go compatível com o SDK 58 usando o QR code. O telefone e o computador devem estar na mesma rede. Use `npm run android` para abrir um emulador Android configurado. No Windows, teste iOS com um iPhone físico e Expo Go; o simulador iOS requer macOS.

```sh
npm run web
```

## Acesso por código

O acesso aos programas acontece exclusivamente pelo formulário de código da biblioteca. Não há atalhos para listar programas, retomar partidas ou jogar novamente fora desse caminho. Ao voltar à biblioteca ou reiniciar/recarregar o app, é preciso digitar o código de novo. O progresso salvo permanece intacto. As rotas de livro e jogo também verificam essa liberação em memória; só informar um código na URL não libera o jogo. Essa regra organiza a navegação e não é um mecanismo de autenticação.

Na biblioteca, digite o código completo impresso no livro: **101–106**. O app reconhece o livro Senninha, abre sua lista de seis programas e destaca o programa correspondente. O prefixo **10** é um atalho criado pelo app para abrir a lista sem escolher um programa; não é apresentado como um código completo impresso no PDF.

Somente o Programa 1 (**101**) está jogável. Os códigos 102–106 são reconhecidos e seus programas aparecem como pendentes de digitalização, sem reutilizar as questões do Programa 1. Código desconhecido mostra um erro. Entrar um código identifica conteúdo cadastrado; não extrai automaticamente questões de um livro novo.

O catálogo está em `src/data/books.ts`. Para cadastrar outro livro, adicione seus programas e questões ao catálogo com identificadores de questões únicos. Sessões e resultados guardam livro e programa, com migração dos dados da primeira versão para o Programa 1 do Senninha.

## O que funciona

- Programa 1 com 30 perguntas adaptadas e explicações.
- Partida rápida: seis perguntas aleatórias, sem repetição.
- Revisão: perguntas erradas, considerando a resposta mais recente nas partidas concluídas.
- Retomada da partida em andamento, histórico de até 100 partidas e melhor resultado do Programa 1.
- Progresso local com AsyncStorage, validação de dados e aviso de falha de armazenamento.
- Navegação com Expo Router, áreas seguras, alternativas identificadas por letra e cor.

Sem login, backend ou coleta de dados. As fontes e a capa são empacotadas, sem dependência de rede durante o uso instalado. No navegador, os dados ficam no armazenamento da origem; apagar os dados do aplicativo ou navegador remove o progresso.

## Verificações

```sh
npm run typecheck
npm run lint
npm test
npm run export:web
```

Os testes verificam o banco, pontuação, conclusão, seleção aleatória, revisão e restauração de dados. A prévia web não substitui testes em aparelhos Android e iOS.

Validação desta versão: TypeScript, ESLint, nove testes automatizados, 20/20 verificações do Expo Doctor e exportações web/Android/iOS (Hermes) aprovados. Fluxo web conferido em viewport de 390 × 844: acerto, erro, pausa, recarregamento, retomada, resultado e revisão. APK/IPA e aparelhos físicos ainda não foram testados.

O npm audit aponta 12 alertas moderados transitivos em ferramentas do Expo e ESLint (`glob` e `minimatch`). As correções compatíveis disponíveis foram aplicadas; a correção automática restante propõe regressão de SDK, por isso não foi forçada.

## Builds para aparelhos

Os identificadores em `app.json` são valores iniciais; ajuste-os para sua organização antes da distribuição. O arquivo `eas.json` contém perfis de desenvolvimento, APK de teste e produção.

```sh
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform ios --profile production
```

É necessário configurar um projeto e credenciais Expo/EAS. A distribuição iOS exige as credenciais e associação Apple apropriadas. O perfil `development` exige instalar `expo-dev-client` com `npx expo install expo-dev-client`. Nenhum build assinado ou envio às lojas é realizado por esses arquivos.

## Organização

```text
src/
  app/                   # Rotas e composição das telas do Expo Router
    _layout.tsx          # Navegação raiz, carregamento de fontes e providers
  components/
    ui/                  # Button, Panel, Typography e Scanlines
    layout/              # Screen, AppHeader e BottomNavigation
    library/             # Formulário de código e cartão de livro cadastrado
    books/               # Cartão de programa
    game/                # Visor da questão e alternativas de resposta
    progress/            # Resumo de progresso e cartão do histórico
    results/             # Placar e revisão de uma resposta
  hooks/                 # Entrada por código e ciclo de uma partida
  theme/                 # Cores e padrões de layout compartilhados
  data/                  # Catálogo de livros, programas e questões
  game/                  # Regras puras e persistência do progresso
```

As telas ficam diretamente em `app`, onde combinam os componentes e mantêm os parâmetros e redirecionamentos de rota. `_layout.tsx` organiza a navegação raiz, as fontes e os providers. Não há uma pasta `screens` nem arquivos intermediários que apenas reexportam as telas. Os componentes recebem dados e ações por props; `BookCodeForm` usa `useBookCode` para o fluxo de entrada. `useGameSession` concentra resposta, pausa, conclusão e proteção contra envio duplicado. O motor de regras e o armazenamento continuam independentes da apresentação.

## Conteúdo e escopo

Fonte: PDF fornecido pelo usuário, “Pense Bem — Senninha conta a história do Ayrton Senna”, edição de 1995. Foram inspecionadas visualmente as páginas do Programa 1 (páginas impressas 3–7, páginas 5–9 do PDF). O PDF é uma digitalização sem camada de texto. A capa em `assets/book-cover.jpg` foi renderizada da primeira página.

Os enunciados e algumas alternativas foram adaptados; as questões 14–19, originalmente associadas a uma figura, receberam descrições textuais. As explicações e gabaritos foram elaborados a partir das questões e precisam de revisão editorial antes de publicação. A questão 29 pergunta a expressão “pole position”, sem tratar o recorde citado em 1995 como atual.

O fluxo avança após cada resposta e permite revisar erros no fim; não emula os códigos eletrônicos, sons ou repetição de erros do aparelho original. Programas 2–6 ainda não foram digitalizados. O modo rápido usa somente o Programa 1 e não corresponde ao Programa 6 do livro.

O PDF original permanece local e está ignorado pelo Git. Marcas, personagens e imagens pertencem aos respectivos titulares. Antes de distribuir publicamente a capa e o conteúdo, obtenha a autorização dos titulares. Não há vínculo oficial com Tectoy, Instituto Ayrton Senna ou Senninha.

Referências técnicas: [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/), [Expo Router](https://docs.expo.dev/router/installation/), [AsyncStorage](https://docs.expo.dev/versions/v58.0.0/sdk/async-storage/).
