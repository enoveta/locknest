import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestCard } from '../../components/LockNestCard';
import { LockNestHeader } from '../../components/LockNestHeader';
import { LockNestToggle } from '../../components/LockNestToggle';
import { colors, sharedStyles, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  return (
    <View style={sharedStyles.container}>
      <View style={styles.container}>
        <LockNestHeader title="Settings" subtitle="Security preferences" onBack={() => navigation.goBack()} />

        <LockNestCard style={styles.card}>
          <LockNestToggle label="Biometric unlock" value={true} onValueChange={() => {}} />
          <LockNestToggle label="Voice assistant" value={true} onValueChange={() => {}} />
          <LockNestToggle label="Security alerts" value={true} onValueChange={() => {}} />
        </LockNestCard>

        <LockNestCard style={styles.card}>
          <Text style={styles.label}>Profile</Text>
          <Text style={styles.value}>Imfurayase Christian</Text>
          <Text style={styles.label}>Theme</Text>
          <Text style={styles.value}>Dark security</Text>
        </LockNestCard>
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
  card: {
    marginBottom: 16,
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
    marginTop: 6,
    fontWeight: '600',
  },
});
