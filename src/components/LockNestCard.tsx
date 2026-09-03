import React from 'react';
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { colors, radii, shadows } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'soft' | 'accent';
};

export function LockNestCard({children, style, variant = 'default'}: Props) {
  return <View style={[styles.card, styles[variant], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 18,
    ...shadows.card,
  },
  default: {
    backgroundColor: colors.panel,
  },
  soft: {
    backgroundColor: colors.cardSoft,
  },
  accent: {
    backgroundColor: 'rgba(77, 163, 255, 0.12)',
    borderColor: 'rgba(77, 163, 255, 0.28)',
  },
});
