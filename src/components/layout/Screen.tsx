import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '../../game/store';
import { colors } from '../../theme/colors';
import { Body } from '../ui/Typography';
import { AppHeader } from './AppHeader';
import { BottomNavigation } from './BottomNavigation';

export function Screen({ children, tabs = true }: { children: React.ReactNode; tabs?: boolean }) {
  const { error } = useProgress();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <AppHeader />
        <ScrollView contentContainerStyle={styles.content}>
          {children}
          {error && <Body style={{ color: colors.red }}>{error}</Body>}
        </ScrollView>
        {tabs && <BottomNavigation />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  shell: { flex: 1, width: '100%', maxWidth: 800, alignSelf: 'center' },
  content: { padding: 22, gap: 22, paddingBottom: 36 },
});
