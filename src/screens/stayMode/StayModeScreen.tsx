import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestButton } from '../../components/LockNestButton';
import { LockNestCard } from '../../components/LockNestCard';
import { LockNestHeader } from '../../components/LockNestHeader';
import { colors, sharedStyles, spacing } from '../../theme';
import { isStayModeActive, activateStayMode, deactivateStayMode, getStayAllowedNames } from '../../services/stayModeService';
import { ensureLocalUser } from '../../services/userService';
import { formatEventTime } from '../../utils/time';

type Props = NativeStackScreenProps<RootStackParamList, 'StayMode'>;

export function StayModeScreen({ navigation }: Props) {
  const [active, setActive] = useState(false);
  const [allowedApps, setAllowedApps] = useState<string[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadState = async () => {
    try {
      const user = await ensureLocalUser();
      setUserId(user.id);
      const isActive = await isStayModeActive(user.id);
      setActive(isActive);
      const apps = await getStayAllowedNames(user.id);
      setAllowedApps(apps);
    } catch (error) {
      console.warn('Failed to load Stay Mode state:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadState();
  }, []);

  const handleActivate = async () => {
    if (userId === null) return;
    try {
      await activateStayMode(userId);
      await loadState();
    } catch (error) {
      console.warn('Failed to activate Stay Mode:', error);
    }
  };

  const handleDeactivate = async () => {
    if (userId === null) return;
    try {
      await deactivateStayMode(userId);
      await loadState();
    } catch (error) {
      console.warn('Failed to deactivate Stay Mode:', error);
    }
  };

  if (loading) {
    return (
      <View style={sharedStyles.container}>
        <View style={styles.container}>
          <LockNestHeader title="Stay Mode" subtitle="Protected sessions" onBack={() => navigation.goBack()} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={sharedStyles.container}>
      <View style={styles.container}>
        <LockNestHeader title="Stay Mode" subtitle="Protected sessions" onBack={() => navigation.goBack()} />

        <LockNestCard variant={active ? 'accent' : 'soft'} style={styles.hero}>
          <Text style={[styles.badge, active ? styles.badgeActive : styles.badgeInactive]}>
            {active ? 'ACTIVE' : 'INACTIVE'}
          </Text>
          <Text style={styles.title}>Stay Mode is {active ? 'active' : 'inactive'}</Text>
          <Text style={styles.meta}>
            {active
              ? 'Allowed apps remain available while high-risk apps stay protected.'
              : 'Enable Stay Mode to allow selected apps only.'}
          </Text>
        </LockNestCard>

        <View style={styles.row}>
          <LockNestButton
            title="Activate"
            onPress={handleActivate}
            disabled={active}
            style={styles.button}
          />
          <LockNestButton
            title="Deactivate"
            variant="danger"
            onPress={handleDeactivate}
            disabled={!active}
            style={styles.button}
          />
        </View>

        <LockNestCard style={styles.details}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{active ? 'Enabled' : 'Disabled'}</Text>
          <Text style={styles.label}>Allowed apps</Text>
          <Text style={styles.value}>{allowedApps.join(', ')}</Text>
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
