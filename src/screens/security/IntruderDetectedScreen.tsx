import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestButton } from '../../components/LockNestButton';
import { LockNestCard } from '../../components/LockNestCard';
import { LockNestHeader } from '../../components/LockNestHeader';
import { colors, sharedStyles, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Intruder'>;

export function IntruderDetectedScreen({ navigation }: Props) {
  return (
    <View style={sharedStyles.container}>
      <View style={styles.container}>
        <LockNestHeader title="Intruder Detected" subtitle="Security notice" onBack={() => navigation.goBack()} />

        <LockNestCard variant="accent" style={styles.hero}>
          <Text style={styles.badge}>ALERT</Text>
          <Text style={styles.title}>Unauthorized access attempt</Text>
          <Text style={styles.meta}>LockNest recorded a failed unlock sequence and flagged suspicious activity for review.</Text>
        </LockNestCard>

        <LockNestCard style={styles.details}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>Monitoring active</Text>
          <Text style={styles.label}>Evidence</Text>
          <Text style={styles.value}>Captured timestamps and security event references are being preserved.</Text>
        </LockNestCard>

        <View style={styles.actions}>
          <LockNestButton title="Review Events" onPress={() => navigation.navigate('SecurityEvents')} />
          <LockNestButton title="Go to Dashboard" variant="secondary" onPress={() => navigation.navigate('Dashboard')} />
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
    marginBottom: 16,
  },
  badge: {
    color: colors.red,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
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
