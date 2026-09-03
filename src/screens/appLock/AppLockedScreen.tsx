import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestButton } from '../../components/LockNestButton';
import { LockNestCard } from '../../components/LockNestCard';
import { LockNestHeader } from '../../components/LockNestHeader';
import { colors, sharedStyles, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AppLocked'>;

export function AppLockedScreen({ navigation, route }: Props) {
  const { appName, emoji, packageName } = route.params;

  return (
    <View style={sharedStyles.container}>
      <View style={styles.container}>
        <LockNestHeader title="App Lock" subtitle="Protected access" onBack={() => navigation.goBack()} />

        <LockNestCard variant="accent" style={styles.hero}>
          <View style={styles.iconWrap}>
            <Text style={styles.iconText}>{emoji}</Text>
          </View>
          <Text style={styles.badge}>LOCKED APP</Text>
          <Text style={styles.title}>{appName}</Text>
          <Text style={styles.meta}>This application is protected by LockNest and cannot be opened without the required passcode.</Text>
        </LockNestCard>

        <LockNestCard style={styles.details}>
          <Text style={styles.label}>Package</Text>
          <Text style={styles.value}>{packageName}</Text>
          <Text style={styles.label}>Security policy</Text>
          <Text style={styles.value}>High-risk app protection enabled</Text>
        </LockNestCard>

        <View style={styles.actions}>
          <LockNestButton title="Unlock App" onPress={() => navigation.navigate('Dashboard')} />
          <LockNestButton title="View Security" variant="secondary" onPress={() => navigation.navigate('SecurityEvents')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 28,
    paddingBottom: 24,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: 'rgba(77,163,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
  },
  badge: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  details: {
    marginBottom: 20,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginTop: 10,
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  actions: {
    gap: 12,
  },
});
