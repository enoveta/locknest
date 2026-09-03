import {
  createUser,
  getUserByDeviceId,
  type User,
} from '../database/repositories/userRepository';
import {
  createUserSettings,
  getUserSettings,
} from '../database/repositories/userSettingsRepository';
import {PROFILE} from '../constants/events';
import {getSecureValue, setSecureValue, secureKeys} from './secureStorage';

function createDeviceId(): string {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .toUpperCase()
    .padStart(6, '0');
  return `LN-${hex}`;
}

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await getSecureValue(secureKeys.DEVICE_SERVICE);
  if (existing) {
    return existing;
  }

  const deviceId = createDeviceId();
  await setSecureValue(secureKeys.DEVICE_SERVICE, 'device', deviceId);
  return deviceId;
}

export async function ensureLocalUser(): Promise<User> {
  const deviceId = await getOrCreateDeviceId();
  const existing = await getUserByDeviceId(deviceId);
  if (existing) {
    const settings = await getUserSettings(existing.id);
    if (!settings) {
      await createUserSettings(existing.id, PROFILE.displayName);
    }
    return existing;
  }

  const user = await createUser({deviceId});
  await createUserSettings(user.id, PROFILE.displayName);
  return user;
}

export async function getDeviceId(): Promise<string> {
  return getOrCreateDeviceId();
}
