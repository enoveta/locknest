export const EVENT_TYPES = {
  APP_LOCKED: 'APP_LOCKED',
  APP_UNLOCKED: 'APP_UNLOCKED',
  STAY_ACTIVATED: 'STAY_ACTIVATED',
  STAY_DEACTIVATED: 'STAY_DEACTIVATED',
  GUEST_ACTIVATED: 'GUEST_ACTIVATED',
  GUEST_DEACTIVATED: 'GUEST_DEACTIVATED',
  UNLOCK_FAILED: 'UNLOCK_FAILED',
  INTRUDER_DETECTED: 'INTRUDER_DETECTED',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export const PROFILE = {
  displayName: 'Imfurayase Christian',
  company: 'Enovela Inc.',
  tagline: 'Your World. Secured.',
} as const;
