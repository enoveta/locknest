import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestCard } from '../../components/LockNestCard';
import { LockNestHeader } from '../../components/LockNestHeader';
import { colors, sharedStyles, spacing } from '../../theme';
import { listProtectedApps, lockApp, unlockApp } from '../../services/appLockService';
import { ensureLocalUser } from '../../services/userService';
import type { ProtectedApp } from '../../database/repositories/protectedAppRepository';
import { openAccessibilitySettings, syncLockedPackages } from '../../services/installedAppsService';
import { accessibilityHelpText } from '../../utils/unlockPolicy';

type Props = NativeStackScreenProps<RootStackParamList, 'AppLock'>;

export function AppLockScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [apps, setApps] = useState<ProtectedApp[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadApps = async () => {
    try {
      const user = await ensureLocalUser();
      setUserId(user.id);
      const protectedApps = await listProtectedApps(user.id);
      setApps(protectedApps);
      await syncLockedPackages(
        protectedApps.filter(app => app.is_locked === 1).map(app => app.package_name),
      );
      setError(null);
    } catch (loadError) {
      setError('Unable to load protected apps. Try again from this device.');
      console.warn('Failed to load protected apps:', loadError);
    }
  };

  useEffect(() => {
    void loadApps();
  }, []);

  const handleToggle = async (app: ProtectedApp) => {
    if (userId === null) {
      return;
    }

    const isLocked = app.is_locked === 1;
    try {
      if (isLocked) {
        await unlockApp(userId, app.package_name);
      } else {
        await lockApp(userId, app.package_name, app.app_name);
      }

      await loadApps();

      if (!isLocked) {
        navigation.navigate('AppLocked', {
          appName: app.app_name,
          emoji: app.app_name.slice(0, 1).toUpperCase(),
          packageName: app.package_name,
        });
      }
    } catch (error) {
      console.warn('Failed to update app lock state:', error);
    }
  };

  const filteredApps = useMemo(() => {
    const normalized = query.toLowerCase();
    if (!normalized) {
      return apps;
    }

    return apps.filter(app => app.app_name.toLowerCase().includes(normalized));
  }, [apps, query]);

  return (
    <View style={sharedStyles.container}>
      <View style={styles.container}>
        <LockNestHeader title="App Lock" subtitle="Protected apps" onBack={() => navigation.goBack()} />

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search apps"
          placeholderTextColor={colors.textMuted}
          style={styles.search}
        />
        <Pressable onPress={openAccessibilitySettings} style={styles.accessibilityButton}>
          <Text style={styles.accessibilityText}>Enable app blocking in Android Settings</Text>
        </Pressable>
        <Text style={styles.helpText}>{accessibilityHelpText()}</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredApps.map(app => {
            const isLocked = app.is_locked === 1;

            return (
              <LockNestCard key={app.id} style={styles.appRow}>
                <Pressable onPress={() => handleToggle(app)} style={styles.appRowContent}>
                  <View style={styles.appIcon}>{app.app_name.slice(0, 1)}</View>
                  <View style={styles.appMeta}>
                    <Text style={styles.appName}>{app.app_name}</Text>
                    <Text style={styles.appState}>{isLocked ? 'Protected' : 'Unprotected'}</Text>
                  </View>
                  <Text style={[styles.statusPill, isLocked ? styles.locked : styles.unlocked]}>
                    {isLocked ? 'Locked' : 'Unlock'}
                  </Text>
                </Pressable>
              </LockNestCard>
            );
          })}
        </ScrollView>
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
  search: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    marginBottom: 16,
  },
  accessibilityButton: {
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(77,163,255,0.15)',
  },
  accessibilityText: {
    color: colors.primarySoft,
    textAlign: 'center',
    fontWeight: '700',
  },
  helpText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  errorText: {
    color: colors.red,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  appRow: {
    marginBottom: 12,
    paddingVertical: 14,
  },
  appRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(77,163,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.text,
    fontWeight: '700',
    fontSize: 18,
    marginRight: 12,
  },
  appMeta: {
    flex: 1,
  },
  appName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  appState: {
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 12,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
  },
  locked: {
    backgroundColor: 'rgba(77,163,255,0.15)',
    color: colors.primarySoft,
  },
  unlocked: {
    backgroundColor: 'rgba(56,211,159,0.12)',
    color: colors.green,
  },
});
