import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestButton } from '../../components/LockNestButton';
import { LockNestCard } from '../../components/LockNestCard';
import { colors, sharedStyles, spacing, typography } from '../../theme';
import { bootstrapApp } from '../../services/bootstrapService';
import type { BootstrapState } from '../../services/bootstrapService';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const shortcuts = [
  {title: 'App Lock', route: 'AppLock'},
  {title: 'Stay Mode', route: 'StayMode'},
  {title: 'Guest Mode', route: 'GuestMode'},
  {title: 'Security', route: 'SecurityEvents'},
  {title: 'Settings', route: 'Settings'},
  {title: 'Profile', route: 'Profile'},
];

export function DashboardScreen({ navigation }: Props) {
  const [state, setState] = useState<BootstrapState | null>(null);

  const loadState = React.useCallback(() => {
    let active = true;

    bootstrapApp()
      .then(nextState => {
        if (active) {
          setState(nextState);
        }
      })
      .catch(error => {
        console.warn('Failed to bootstrap LockNest:', error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return loadState();
  }, [loadState]);

  useFocusEffect(
    React.useCallback(() => {
      loadState();
    }, [loadState]),
  );

  const statusCards = [
    {
      label: 'Security Status',
      value: state?.notifications.length ? 'Protected' : 'Ready',
      tone: 'green',
    },
    {
      label: 'Protected Apps',
      value: String(state?.lockedApps.length ?? 0),
      tone: 'blue',
    },
    {
      label: 'Stay Mode',
      value: state?.stayModeActive ? 'Active' : 'Off',
      tone: 'purple',
    },
    {
      label: 'Guest Mode',
      value: state?.guestModeActive ? 'On' : 'Off',
      tone: 'gray',
    },
  ];

  return (
    <View style={sharedStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>LOCKNEST</Text>
            <Text style={styles.title}>Dashboard</Text>
          </View>
          <View style={styles.micButton}>
            <Text
              style={styles.micText}
              onPress={() => {
                if (state?.settings.voiceEnabled === false) {
                  navigation.navigate('Settings');
                  return;
                }
                navigation.navigate('VoiceAssistant');
              }}>
              🎙️
            </Text>
          </View>
        </View>

        <LockNestCard variant="accent" style={styles.heroCard}>
          <Text style={styles.heroLabel}>Security status</Text>
          <Text style={styles.heroValue}>All systems secure</Text>
          <Text style={styles.heroMeta}>
            {state?.lockedApps.length ?? 0} apps monitored • {state?.stayModeActive ? 'Stay Mode active' : 'Stay Mode idle'}
          </Text>
        </LockNestCard>

        <View style={styles.statusGrid}>
          {statusCards.map(card => (
            <View key={card.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{card.label}</Text>
              <Text style={[styles.statValue, card.tone === 'green' ? styles.green : card.tone === 'purple' ? styles.purple : card.tone === 'blue' ? styles.blue : styles.gray]}>{card.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Quick actions</Text>
        </View>
        <View style={styles.quickGrid}>
          {shortcuts.map(item => (
            <LockNestButton
              key={item.title}
              title={item.title}
              variant="secondary"
              onPress={() => navigation.navigate(item.route as any)}
              style={styles.quickButton}
            />
          ))}
        </View>

        <LockNestCard style={styles.activityCard}>
          <Text style={styles.sectionLabel}>Recent security activity</Text>
          {(state?.events ?? []).slice(0, 3).map(event => (
            <View key={event.id} style={styles.activityItem}>
              <Text style={styles.activityBullet}>●</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{event.event_type.replace(/_/g, ' ')}</Text>
                <Text style={styles.activityText}>{event.description ?? 'System event'} • {event.created_at}</Text>
              </View>
            </View>
          ))}
        </LockNestCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: 50,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  eyebrow: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    marginTop: 4,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.panelStrong,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  micText: {
    fontSize: 20,
  },
  heroCard: {
    marginBottom: 18,
  },
  heroLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroValue: {
    marginTop: 8,
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
  },
  heroMeta: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 13,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.panel,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  green: {color: colors.green},
  blue: {color: colors.primarySoft},
  purple: {color: colors.purple},
  gray: {color: colors.textMuted},
  sectionHeader: {
    marginBottom: 12,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  quickGrid: {
    marginBottom: 18,
  },
  quickButton: {
    marginBottom: 10,
  },
  activityCard: {
    marginTop: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 18,
  },
  activityBullet: {
    color: colors.primary,
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  activityText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
