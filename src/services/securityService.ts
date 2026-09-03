import {
  createAuthAttempt,
  createIntruderEvidence,
  createSecurityEvent,
  getIntruderEvidenceByEvent,
  getSecurityEventsByUser,
  type SecurityEvent,
} from '../database/repositories/securityRepository';
import {EVENT_TYPES} from '../constants/events';
import {formatEventTime} from '../utils/time';
import type {AppNotification, NotificationType} from '../types';

function eventToNotification(event: SecurityEvent): AppNotification {
  const map: Record<string, {type: NotificationType; title: string}> = {
    [EVENT_TYPES.INTRUDER_DETECTED]: {
      type: 'intruder',
      title: 'Intruder Detected',
    },
    [EVENT_TYPES.UNLOCK_FAILED]: {
      type: 'passcode',
      title: 'Wrong Passcode',
    },
    [EVENT_TYPES.APP_UNLOCKED]: {
      type: 'unlock',
      title: 'App Unlocked',
    },
    [EVENT_TYPES.STAY_ACTIVATED]: {
      type: 'mode',
      title: 'Stay Mode Enabled',
    },
    [EVENT_TYPES.GUEST_ACTIVATED]: {
      type: 'mode',
      title: 'Guest Mode Enabled',
    },
    [EVENT_TYPES.APP_LOCKED]: {
      type: 'system',
      title: 'App Locked',
    },
  };

  const meta = map[event.event_type] ?? {
    type: 'system' as NotificationType,
    title: event.event_type.replace(/_/g, ' '),
  };

  return {
    id: String(event.id),
    type: meta.type,
    title: meta.title,
    body: event.description ?? event.event_type,
    time: formatEventTime(event.created_at),
    read: false,
    eventId: event.id,
  };
}

export async function listSecurityEvents(userId: number) {
  return getSecurityEventsByUser(userId);
}

export async function listNotifications(
  userId: number,
): Promise<AppNotification[]> {
  const events = await getSecurityEventsByUser(userId);
  return events.slice(0, 20).map(eventToNotification);
}

export async function recordFailedUnlock(
  userId: number,
  packageName: string | undefined,
  attemptCount: number,
): Promise<number> {
  const eventId = await createSecurityEvent(
    userId,
    EVENT_TYPES.UNLOCK_FAILED,
    packageName,
    'Wrong passcode entered',
  );
  await createAuthAttempt(eventId, 'passcode', false, packageName);

  if (attemptCount >= 2) {
    const intruderId = await createSecurityEvent(
      userId,
      EVENT_TYPES.INTRUDER_DETECTED,
      packageName,
      `${attemptCount} failed unlock attempts`,
    );
    return intruderId;
  }

  return eventId;
}

export async function recordIntruderEvidence(
  eventId: number,
  filePath: string,
): Promise<void> {
  await createIntruderEvidence(eventId, filePath);
}

export async function getEvidenceForEvent(eventId: number) {
  return getIntruderEvidenceByEvent(eventId);
}

export function eventLabel(eventType: string): string {
  switch (eventType) {
    case EVENT_TYPES.INTRUDER_DETECTED:
      return 'Intruder detected';
    case EVENT_TYPES.UNLOCK_FAILED:
      return 'Wrong passcode';
    case EVENT_TYPES.APP_UNLOCKED:
      return 'App unlocked';
    case EVENT_TYPES.APP_LOCKED:
      return 'App locked';
    case EVENT_TYPES.STAY_ACTIVATED:
      return 'Stay mode enabled';
    case EVENT_TYPES.STAY_DEACTIVATED:
      return 'Stay mode disabled';
    case EVENT_TYPES.GUEST_ACTIVATED:
      return 'Guest mode enabled';
    case EVENT_TYPES.GUEST_DEACTIVATED:
      return 'Guest mode disabled';
    default:
      return eventType;
  }
}
