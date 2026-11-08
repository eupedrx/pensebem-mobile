import React from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { colors } from '../../theme/colors';

export function Label({ children, style, ...props }: TextProps & { style?: TextStyle }) {
  return (
    <Text {...props} style={[s.label, style]}>
      {children}
    </Text>
  );
}
export function Body({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[s.body, style]}>{children}</Text>;
}
export function Title({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return (
    <Text accessibilityRole="header" style={[s.title, style]}>
      {children}
    </Text>
  );
}

const s = StyleSheet.create({
  label: {
    fontFamily: 'SpaceMono_400Regular',
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 1,
  },
  body: { fontFamily: 'SpaceMono_400Regular', color: colors.muted, fontSize: 13, lineHeight: 23 },
  title: {
    fontFamily: 'SpaceMono_700Bold',
    color: colors.text,
    fontSize: 28,
    lineHeight: 37,
    letterSpacing: -1,
  },
});
