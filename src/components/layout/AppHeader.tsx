import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { Label } from '../ui/Typography';

export function AppHeader() {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ir para a biblioteca"
        onPress={() => router.replace('/')}
      >
        <Text style={styles.brand}>
          PENSEBEM
        </Text>
      </Pressable>
      <Label>EDIÇÃO DIGITAL</Label>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 22,
    paddingVertical: 19,
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  brand: {
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 21,
    color: colors.cyan,
    letterSpacing: -1,
  },
});
