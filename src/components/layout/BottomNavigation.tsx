import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

const tabs = [
  { label: 'Biblioteca', path: '/' },
  { label: 'Progresso', path: '/progress' },
  { label: 'Como jogar', path: '/about' },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.path}
          accessibilityRole="tab"
          accessibilityState={{ selected: pathname === tab.path }}
          onPress={() => router.replace(tab.path)}
          style={[styles.tab, pathname === tab.path && { borderTopColor: colors.cyan }]}
        >
          <Text style={[styles.text, pathname === tab.path && { color: colors.cyan }]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderTopColor: colors.line,
    borderTopWidth: 1,
    backgroundColor: colors.panel,
  },
  tab: {
    flex: 1,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderTopColor: 'transparent',
  },
  text: { fontFamily: 'SpaceMono_400Regular', color: colors.muted, fontSize: 11 },
});
