import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestCard } from '../../components/LockNestCard';
import { LockNestHeader } from '../../components/LockNestHeader';
import { LockNestToggle } from '../../components/LockNestToggle';
import { colors, sharedStyles, spacing } from '../../theme';
import { ensureLocalUser } from '../../services/userService';
import { loadSettings, saveSettings } from '../../services/settingsService';
import type { AppSettings } from '../../types';
import { MAX_FAILED_ATTEMPT_OPTIONS } from '../../utils/unlockPolicy';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const [userId, setUserId] = useState<number | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureLocalUser()
      .then(async user => {
        setUserId(user.id);
        setSettings(await loadSettings(user.id));
      })
      .catch(() => setError('Unable to load settings.'));
  }, []);

  const updateSetting = async (patch: Partial<AppSettings>) => {
    if (userId === null || !settings) {
      return;
    }

    const next = {...settings, ...patch};
    setSettings(next);
    try {
      await saveSettings(userId, patch);
      setError(null);
    } catch {
      setSettings(settings);
      setError('Unable to save settings.');
    }
  };

  return (
    <View style={sharedStyles.container}>
      <View style={styles.container}>
        <LockNestHeader title="Settings" subtitle="Security preferences" onBack={() => navigation.goBack()} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <LockNestCard style={styles.card}>
          <LockNestToggle
            label="Biometric unlock"
            value={settings?.biometricEnabled ?? false}
            onValueChange={value => updateSetting({biometricEnabled: value})}
          />
          <LockNestToggle
            label="Voice assistant"
            value={settings?.voiceEnabled ?? false}
            onValueChange={value => updateSetting({voiceEnabled: value})}
          />
          <LockNestToggle
            label="Security alerts"
            value={settings?.notificationsEnabled ?? false}
            onValueChange={value => updateSetting({notificationsEnabled: value})}
          />
        </LockNestCard>

        <LockNestCard style={styles.card}>
          <Text style={styles.label}>Failed attempts before photo</Text>
          <View style={styles.row}>
            {MAX_FAILED_ATTEMPT_OPTIONS.map(option => (
              <Pressable
                key={option}
                onPress={() => updateSetting({maxFailedAttempts: option})}
                style={[
                  styles.option,
                  settings?.maxFailedAttempts === option ? styles.optionSelected : null,
                ]}>
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </LockNestCard>

        <LockNestCard style={styles.card}>
          <Text style={styles.label}>Profile</Text>
          <Text style={styles.value}>{settings?.displayName ?? 'LockNest user'}</Text>
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
  error: {
    color: colors.red,
    marginBottom: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  option: {
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    color: colors.text,
    fontWeight: '700',
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
