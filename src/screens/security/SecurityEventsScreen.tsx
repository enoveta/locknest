import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { LockNestCard } from '../../components/LockNestCard';
import { LockNestHeader } from '../../components/LockNestHeader';
import { colors, sharedStyles, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SecurityEvents'>;

const events = [
  {title: 'App locked', detail: 'Instagram • 9:42 AM', tone: 'blue'},
  {title: 'Stay Mode enabled', detail: 'Secure browsing • 8:17 AM', tone: 'green'},
  {title: 'Wrong passcode', detail: 'App unlock attempt • 7:51 AM', tone: 'red'},
  {title: 'Guest mode ended', detail: 'Session closed • 6:27 AM', tone: 'purple'},
];

export function SecurityEventsScreen({ navigation }: Props) {
  return (
    <View style={sharedStyles.container}>
      <View style={styles.container}>
        <LockNestHeader title="Security Events" subtitle="Recent activity" onBack={() => navigation.goBack()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {events.map(event => (
            <LockNestCard key={event.title} style={styles.eventCard}>
              <View style={styles.eventRow}>
                <View style={[styles.marker, event.tone === 'blue' ? styles.blue : event.tone === 'green' ? styles.green : event.tone === 'red' ? styles.red : styles.purple]} />
                <View style={styles.meta}>
                  <Text style={styles.title}>{event.title}</Text>
                  <Text style={styles.detail}>{event.detail}</Text>
                </View>
              </View>
            </LockNestCard>
          ))}
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
  eventCard: {
    marginBottom: 12,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  marker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: 12,
  },
  blue: {backgroundColor: colors.primary},
  green: {backgroundColor: colors.green},
  red: {backgroundColor: colors.red},
  purple: {backgroundColor: colors.purple},
  meta: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  detail: {
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 13,
  },
});
