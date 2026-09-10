import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestButton } from '../../components/LockNestButton';
import { LockNestCard } from '../../components/LockNestCard';
import { LockNestHeader } from '../../components/LockNestHeader';
import { colors, sharedStyles, spacing } from '../../theme';
import { EXAMPLE_VOICE_COMMANDS, executeVoiceCommand } from '../../services/voiceCommandService';
import { ensureLocalUser } from '../../services/userService';
import { loadSettings } from '../../services/settingsService';

const phases = {
  idle: 'Ready',
  listening: 'Listening...',
  processing: 'Processing...',
  success: 'Completed',
  error: 'Try again',
};

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceAssistant'>;

export function VoiceAssistantScreen({ navigation }: Props) {
  const [phase, setPhase] = useState<'idle' | 'listening' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('Tap the mic and say a command.');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    ensureLocalUser()
      .then(user => loadSettings(user.id))
      .then(settings => {
        setVoiceEnabled(settings.voiceEnabled);
        if (!settings.voiceEnabled) {
          setPhase('error');
          setMessage('Voice assistant is turned off in Settings.');
        }
      })
      .catch(() => undefined);
  }, []);

  const examples = useMemo(() => EXAMPLE_VOICE_COMMANDS, []);

  const handleCommand = async (raw: string) => {
    if (!voiceEnabled) {
      setPhase('error');
      setMessage('Voice assistant is turned off in Settings.');
      return;
    }
    setPhase('listening');
    setMessage('Listening...');

    setTimeout(async () => {
      setPhase('processing');
      setMessage('Processing...');

      try {
        const user = await ensureLocalUser();
        const result = await executeVoiceCommand(user.id, raw);
        setPhase(result.ok ? 'success' : 'error');
        setMessage(result.message);

        if (result.navigateTo) {
          setTimeout(() => {
            navigation.navigate(result.navigateTo as any);
          }, 600);
        }
      } catch (error) {
        console.warn('Voice command failed:', error);
        setPhase('error');
        setMessage('Voice command failed. Please try again.');
      }
    }, 400);
  };

  return (
    <View style={sharedStyles.container}>
      <View style={styles.container}>
        <LockNestHeader title="Voice Assistant" subtitle="Intentional control" onBack={() => navigation.goBack()} />

        <LockNestCard variant="accent" style={styles.hero}>
          <Text style={styles.phase}>{phases[phase]}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable onPress={() => handleCommand('Put LOCKNEST in Stay Mode.')} style={styles.micButton}>
            <Text style={styles.micText}>🎙️</Text>
          </Pressable>
        </LockNestCard>

        <LockNestCard style={styles.examplesCard}>
          <Text style={styles.label}>Example commands</Text>
          <ScrollView style={styles.list}>
            {examples.map(example => (
              <Pressable key={example.action} onPress={() => handleCommand(example.label)} style={styles.commandRow}>
                <Text style={styles.commandText}>{example.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </LockNestCard>

        <LockNestButton title="Back to Dashboard" variant="secondary" onPress={() => navigation.navigate('Dashboard')} />
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
    alignItems: 'center',
  },
  phase: {
    color: colors.primarySoft,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: '700',
  },
  message: {
    marginTop: 10,
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
  },
  micButton: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  micText: {
    fontSize: 34,
  },
  examplesCard: {
    marginBottom: 16,
    flex: 1,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  list: {
    maxHeight: 210,
  },
  commandRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  commandText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
