import { StyleSheet, View } from 'react-native';

export function Scanlines() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: 35 }, (_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: i * 7,
            height: 1,
            width: '100%',
            backgroundColor: '#00FF4109',
          }}
        />
      ))}
    </View>
  );
}
