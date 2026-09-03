import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { colors, radii, shadows, typography } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  title: string;
  variant?: Variant;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function LockNestButton({
  title,
  variant = 'primary',
  onPress,
  disabled = false,
  style,
  textStyle,
}: Props) {
  const buttonStyle = [styles.button, styles[variant], disabled && styles.disabled, style];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [
        buttonStyle,
        pressed && !disabled ? styles.pressed : null,
      ]}>
      <Text style={[styles.label, styles[`${variant}Label`], disabled && styles.disabledLabel, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    ...shadows.card,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: 'rgba(255, 93, 115, 0.12)',
    borderColor: 'rgba(255, 93, 115, 0.4)',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    ...typography.body,
    fontWeight: '700',
  },
  primaryLabel: {
    color: '#041525',
  },
  secondaryLabel: {
    color: colors.text,
  },
  ghostLabel: {
    color: colors.primarySoft,
  },
  dangerLabel: {
    color: colors.red,
  },
  disabledLabel: {
    opacity: 0.6,
  },
});
