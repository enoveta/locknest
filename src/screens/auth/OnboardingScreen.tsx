import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestButton } from '../../components/LockNestButton';
import { colors, sharedStyles, spacing, typography } from '../../theme';
import { markOnboardingComplete } from '../../services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'> & {
  onComplete?: () => void;
};

const slides = [
  {
    title: 'Secure.',
    body: 'Keep your private apps protected from unauthorized access.',
  },
  {
    title: 'Private.',
    body: 'Lock sensitive content behind your personal passcode and secure storage.',
  },
  {
    title: 'Peace of mind.',
    body: 'Stay in control with monitoring, guest mode, and smart app protection.',
  },
];

export function OnboardingScreen({ navigation, onComplete }: Props) {
  const goNext = async () => {
    try {
      await markOnboardingComplete();
    } catch (error) {
      console.warn('Failed to mark onboarding complete:', error);
    }

    onComplete?.();
    navigation.replace('Passcode', { mode: 'create' });
  };

  return (
    <View style={sharedStyles.container}>
      <View style={styles.container}>
        <View style={styles.preview}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🔒</Text>
          </View>
        </View>

        <View style={styles.meta}>
          <Text style={styles.label}>WELCOME</Text>
          <Text style={styles.title}>{slides[1].title}</Text>
          <Text style={styles.body}>{slides[1].body}</Text>
        </View>

        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === 1 ? styles.dotActive : null]}
            />
          ))}
        </View>

        <LockNestButton title="Get Started" onPress={goNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  preview: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  badge: {
    width: 180,
    height: 180,
    borderRadius: 52,
    backgroundColor: 'rgba(77, 163, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(77, 163, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 80,
  },
  meta: {
    alignItems: 'center',
  },
  label: {
    color: colors.primarySoft,
    fontSize: 12,
    letterSpacing: 1.8,
    fontWeight: '700',
    marginBottom: 12,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: 10,
  },
  body: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 34,
    backgroundColor: colors.primary,
  },
});
