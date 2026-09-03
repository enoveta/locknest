import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../theme';

type Props = {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
};

export function LockNestToggle({label, value, onValueChange}: Props) {
  return (
    <Pressable style={styles.row} onPress={() => onValueChange(!value)}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.track, value && styles.trackOn]}>
        <View style={[styles.thumb, value && styles.thumbOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  track: {
    width: 52,
    height: 30,
    borderRadius: radii.round,
    backgroundColor: '#1a2a3e',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: 'rgba(56, 211, 159, 0.2)',
    borderColor: 'rgba(56, 211, 159, 0.5)',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#b4c9df',
    alignSelf: 'flex-start',
  },
  thumbOn: {
    backgroundColor: colors.green,
    alignSelf: 'flex-end',
  },
});
