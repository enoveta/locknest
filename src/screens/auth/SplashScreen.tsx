import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { colors, radii, sharedStyles, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={sharedStyles.container}>
      <View style={styles.screen}>
        <View style={styles.logoWrap}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoMark}>L</Text>
          </View>
        </View>
        <Text style={styles.title}>LOCKNEST</Text>
        <Text style={styles.tagline}>YOUR WORLD. SECURED.</Text>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  logoWrap: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(77, 163, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(77, 163, 255, 0.3)',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    color: '#07111d',
    fontSize: 36,
    fontWeight: '800',
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginTop: 24,
    letterSpacing: 2,
  },
  tagline: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  loader: {
    marginTop: 28,
  },
});
