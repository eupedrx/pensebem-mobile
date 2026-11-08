import { router } from 'expo-router';
import { Screen } from '../components/layout/Screen';
import { Button, Title } from '../components/ui';
export default function NotFoundScreen() {
  return (
    <Screen>
      <Title>Página não encontrada</Title>
      <Button onPress={() => router.replace('/')}>Voltar à biblioteca</Button>
    </Screen>
  );
}
