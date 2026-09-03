import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestButton } from '../../components/LockNestButton';
import { LockNestCard } from '../../components/LockNestCard';
import { LockNestHeader } from '../../components/LockNestHeader';
import { colors, sharedStyles, spacing } from '../../theme';
import { isGuestModeActive, activateGuestMode, deactivateGuestMode, getGuestSessionInfo } from '../../services/guestModeService';
import { ensureLocalUser } from '../../services/userService';

type Props = NativeStackScreenProps<RootStackParamList, 'GuestMode'>;

export function GuestModeScreen({ navigation }: Props) {
  const [active, setActive] = useState(false);
  const [allowedApps, setAllowedApps] = useState<string[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadState = async () => {
    try {
      const user = await ensureLocalUser();
      setUserId(user.id);
      const isActive = await isGuestModeActive(user.id);
      setActive(isActive);
      if (isActive) {
        const info = await getGuestSessionInfo(user.id);
        if (info) {
          setAllowedApps(info.allowedNames);
        }
      } else {
        setAllowedApps(['Phone', 'Messages', 'Chrome']);
      }
    } catch (error) {
      console.warn('Failed to load Guest Mode state:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadState();
  }, []);

  const handleEnable = async () => {
    if (userId === null) return;
    try {
      await activateGuestMode(userId);
      await loadState();
    } catch (error) {
      console.warn('Failed to enable Guest Mode:', error);
    }
  };

  const handleDisable = async () => {
    if (userId === null) return;
    try {
      await deactivateGuestMode(userId);
      await loadState();
    } catch (error) {
      console.warn('Failed to disable Guest Mode:', error);
    }
  };

  if (loading) {
    return (
      <View style={sharedStyles.container}>
        <View style={styles.container}>
          <LockNestHeader title="Guest Mode" subtitle="Temporary access" onBack={() => navigation.goBack()} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={sharedStyles.container}>
      <View style={styles.container}>
        <LockNestHeader title="Guest Mode" subtitle="Temporary access" onBack={() => navigation.goBack()} />

        <LockNestCard variant={active ? 'accent' : 'soft'} style={styles.hero}>
          <Text style={[styles.badge, active ? styles.badgeActive : styles.badgeInactive]}>
            {active ? 'ACTIVE' : 'OFFLINE'}
          </Text>
          <Text style={styles.title}>Guest mode is {active ? 'enabled' : 'disabled'}</Text>
          <Text style={styles.meta}>
            {active
              ? 'Selected apps are available. All private content remains hidden.'
              : 'Allow selected apps only while keeping private content hidden.'}
          </Text>
        </LockNestCard>

        <View style={styles.row}>
          <LockNestButton
            title="Enable"
            onPress={handleEnable}
            disabled={active}
            style={styles.button}
          />
          <LockNestButton
            title={active ? 'Disable' : 'Clear'}
            variant="ghost"
            onPress={handleDisable}
            style={styles.button}
          />
        </View>

        <LockNestCard style={styles.details}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{active ? 'Enabled' : 'Disabled'}</Text>
          <Text style={styles.label}>Allowed apps</Text>
          <Text style={styles.value}>{allowedApps.join(', ')}</Text>
          <Text style={styles.label}>Session expiry</Text>
          <Text style={styles.value}>4 hours from activation</Text>
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
  loadingText: {
    color: colors.textMuted,
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  hero: {
    marginBottom: 18,
  },
  badge: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 8,
  },
  badgeActive: {
    color: colors.green,
  },
  badgeInactive: {
    color: colors.amber,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  meta: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginRight: 8,
  },
  details: {
    marginTop: 8,
  },
  label: {
    color: colors.textMuted,
    marginTop: 12,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: 16,
    marginTop: 6,
    fontWeight: '600',
  },
});
