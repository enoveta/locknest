import {sha256} from '../utils/hash';
import {
  getSecureValue,
  setSecureValue,
  deleteSecureValue,
  secureKeys,
} from './secureStorage';

const SALT_PREFIX = 'locknest.pin.v1';

function hashPasscode(passcode: string, salt: string): string {
  return sha256(`${SALT_PREFIX}:${salt}:${passcode}`);
}

function createSalt(): string {
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
}

export async function hasPasscode(): Promise<boolean> {
  const stored = await getSecureValue(secureKeys.PASSCODE_SERVICE);
  return Boolean(stored);
}

export async function savePasscode(passcode: string): Promise<void> {
  const salt = createSalt();
  const hash = hashPasscode(passcode, salt);
  await setSecureValue(
    secureKeys.PASSCODE_SERVICE,
    'passcode',
    JSON.stringify({salt, hash}),
  );
}

export async function verifyPasscode(passcode: string): Promise<boolean> {
  const stored = await getSecureValue(secureKeys.PASSCODE_SERVICE);
  if (!stored) {
    return false;
  }

  try {
    const parsed = JSON.parse(stored) as {salt: string; hash: string};
    return hashPasscode(passcode, parsed.salt) === parsed.hash;
  } catch {
    return false;
  }
}

export async function clearPasscode(): Promise<void> {
  await deleteSecureValue(secureKeys.PASSCODE_SERVICE);
}

export async function isOnboardingComplete(): Promise<boolean> {
  const value = await getSecureValue(secureKeys.ONBOARDING_SERVICE);
  return value === '1';
}

export async function markOnboardingComplete(): Promise<void> {
  await setSecureValue(secureKeys.ONBOARDING_SERVICE, 'onboarding', '1');
}
