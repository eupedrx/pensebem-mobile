import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';

export function Button({
  children,
  onPress,
  secondary,
  disabled,
  accessibilityLabel,
}: {
  children: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        disabled && { opacity: 0.4 },
        pressed && { opacity: 0.7, transform: [{ translateY: 2 }] },
      ]}
    >
      <Text style={[s.buttonText, secondary && { color: colors.text }]}>{children}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  button: {
    backgroundColor: colors.green,
    minHeight: 54,
    padding: 15,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.green,
  },
  secondary: { backgroundColor: 'transparent', borderColor: colors.line },
  buttonText: {
    color: colors.onKey,
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 14,
    textAlign: 'center',
  },
});
