import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

export function Panel({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.panel, style]}>{children}</View>;
}

const s = StyleSheet.create({
  panel: {
    padding: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
