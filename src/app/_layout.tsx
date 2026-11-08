import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProgressProvider, useProgress } from '../game/store';
import { colors } from '../theme/colors';

function Routes() {
  const { ready } = useProgress();
  if (!ready)
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.green} accessibilityLabel="Carregando progresso" />
      </View>
    );
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'fade',
      }}
    />
  );
}
export default function Layout() {
  const [loaded, error] = useFonts({
    SpaceMono_400Regular,
    SpaceMono_700Bold,
    ArialRoundedMTBold: require('../../assets/arlrdbd.ttf'),
  });
  if (!loaded && !error) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <StatusBar style="dark" />
        <Routes />
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
