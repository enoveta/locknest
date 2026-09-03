import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestButton } from '../../components/LockNestButton';
import { colors, sharedStyles, spacing, typography } from '../../theme';
import { savePasscode } from '../../services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'Passcode'> & {
  onComplete?: () => void;
  mode?: 'create' | 'unlock' | 'change';
};

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

export function PasscodeScreen({ navigation, onComplete, mode = 'create' }: Props) {
  const [value, setValue] = useState('');

  const title = useMemo(() => {
    if (mode === 'unlock') return 'Unlock LOCKNEST';
    if (mode === 'change') return 'Change Passcode';
    return 'Create Passcode';
  }, [mode]);

  const onNumberPress = (digit: string) => {
    if (digit === '⌫') {
      setValue(current => current.slice(0, -1));
      return;
    }

    if (digit === '') {
      return;
    }

    setValue(current => (current + digit).slice(0, 6));
  };

  const submit = async () => {
    if (value.length < 4) {
      return;
    }

    try {
      await savePasscode(value);
    } catch (error) {
      console.warn('Failed to save passcode:', error);
    }

    onComplete?.();
    navigation.replace('Dashboard');
  };

  return (
    <View style={sharedStyles.container}>
      <View style={styles.screen}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Enter a 4-6 digit passcode</Text>

        <View style={styles.pinRow}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View
              key={index}
              style={[styles.pinDot, index < value.length ? styles.pinDotFilled : null]}
            />
          ))}
        </View>

        <View style={styles.keypad}>
          {digits.map((digit, index) => (
            <View key={`${digit || 'empty'}-${index}`} style={styles.keypadCell}>
              {digit ? (
                <Text onPress={() => onNumberPress(digit)} style={styles.key}>{digit}</Text>
              ) : (
                <View style={styles.keySpacer} />
              )}
            </View>
          ))}
        </View>

        <LockNestButton
          title={mode === 'create' ? 'Continue' : 'Unlock'}
          onPress={submit}
          disabled={value.length < 4}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 22,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  pinDotFilled: {
    backgroundColor: colors.primary,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  keypadCell: {
    width: '33.333%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  key: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    width: 60,
    height: 60,
    borderRadius: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  keySpacer: {
    width: 60,
    height: 60,
  },
});
