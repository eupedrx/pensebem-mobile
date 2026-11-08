import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../../theme/colors';
import { Body, Button, Label, Panel } from '../ui';
import { useBookCode } from '../../hooks/useBookCode';

const digitSegments: Record<string, string> = {
  '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg',
  '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg',
};
const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const;

function DisplayDigit({ digit }: { digit: string }) {
  return <View style={local.digit}>
    {segments.map(segment => <View key={segment} style={[
      local.segment, local[segment],
      digitSegments[digit]?.includes(segment) && local.segmentLit,
    ]} />)}
  </View>;
}

export function BookCodeForm() {
  const { code, error, changeCode, submit } = useBookCode();
  const [focused, setFocused] = useState(false);
  return (
    <Panel>
      <Label nativeID="book-code-label">CÓDIGO DO LIVRO OU PROGRAMA</Label>
      <View style={local.frame}>
        <View style={[local.display, focused && local.displayFocused]}>
          <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={local.digits}>
            {code.padStart(3, ' ').split('').map((digit, index) => <DisplayDigit key={index} digit={digit} />)}
          </View>
          <TextInput
            accessibilityLabel="Código do livro ou programa"
            accessibilityLabelledBy="book-code-label"
            accessibilityHint="Digite dois ou três números para abrir o livro ou programa."
            value={code}
            onChangeText={value => changeCode(value.replace(/\D/g, '').slice(0, 3))}
            keyboardType="number-pad"
            inputMode="numeric"
            maxLength={3}
            caretHidden
            autoCorrect={false}
            selectionColor="#FF483B55"
            returnKeyType="go"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSubmitEditing={submit}
            style={local.input}
          />
          <View pointerEvents="none" style={local.indicators}>
            {['#AC3437', '#B8A04B', '#387C95', '#3B7166'].map(backgroundColor => <View key={backgroundColor} style={[local.indicator, { backgroundColor }]} />)}
          </View>
        </View>
      </View>
      <Body>
        Toque no visor e digite 10 para ver os programas do Senninha, ou o código impresso no livro: 101 a 106.
      </Body>
      {error ? (
        <Label accessibilityRole="alert" style={{ color: colors.red, lineHeight: 21 }}>
          {error}
        </Label>
      ) : null}
      <Button onPress={submit} disabled={!code.trim()}>Abrir livro</Button>
    </Panel>
  );
}
const local = StyleSheet.create({
  frame: {
    backgroundColor: '#AEA48A', borderWidth: 2, borderTopColor: '#C7BDA2',
    borderLeftColor: '#BEB498', borderRightColor: '#8C826C', borderBottomColor: '#807660',
    borderRadius: 5, padding: 12,
  },
  display: {
    backgroundColor: '#160B0E', borderWidth: 3, borderTopColor: '#4B4337',
    borderLeftColor: '#51473B', borderBottomColor: '#C7BDA2', borderRightColor: '#BEB498',
    minHeight: 106, justifyContent: 'center', overflow: 'hidden',
  },
  displayFocused: { borderBottomColor: '#FF6A56' },
  digits: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, paddingHorizontal: 22, paddingVertical: 18 },
  digit: { width: 28, height: 48, transform: [{ skewX: '-6deg' }] },
  segment: { position: 'absolute', backgroundColor: '#321317', borderRadius: 2 },
  segmentLit: {
    backgroundColor: '#FF483B',
    boxShadow: '0 0 5px #FF3029, 0 0 12px #FF302966',
  },
  a: { top: 0, left: 4, width: 20, height: 4 },
  b: { top: 4, right: 0, width: 4, height: 18 },
  c: { bottom: 4, right: 0, width: 4, height: 18 },
  d: { bottom: 0, left: 4, width: 20, height: 4 },
  e: { bottom: 4, left: 0, width: 4, height: 18 },
  f: { top: 4, left: 0, width: 4, height: 18 },
  g: { top: 22, left: 4, width: 20, height: 4 },
  input: {
    position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
    color: 'transparent', backgroundColor: 'transparent',
    fontSize: 48, textAlign: 'right', paddingHorizontal: 22,
  },
  indicators: { position: 'absolute', bottom: 4, right: 18, flexDirection: 'row', gap: 5 },
  indicator: { width: 16, height: 4 },
});
