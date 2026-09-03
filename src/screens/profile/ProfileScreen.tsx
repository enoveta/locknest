import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestButton } from '../../components/LockNestButton';
import { LockNestCard } from '../../components/LockNestCard';
import { LockNestHeader } from '../../components/LockNestHeader';
import { colors, sharedStyles, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  return (
    <View style={sharedStyles.container}>
      <View style={styles.container}>
        <LockNestHeader title="Profile" subtitle="Account overview" onBack={() => navigation.goBack()} />

        <LockNestCard style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>IC</Text>
          </View>
          <Text style={styles.name}>Imfurayase Christian</Text>
          <Text style={styles.role}>Enoveta Inc.</Text>
          <Text style={styles.tagline}>Your World. Secured.</Text>
        </LockNestCard>

        <LockNestButton title="Edit Profile" variant="secondary" onPress={() => {}} />
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
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(77,163,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  role: {
    color: colors.textMuted,
    marginTop: 6,
    fontSize: 14,
  },
  tagline: {
    color: colors.primarySoft,
    marginTop: 16,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
});
