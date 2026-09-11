import * as Keychain from 'react-native-keychain';

const PASSCODE_SERVICE = 'com.locknest.passcode';
const DEVICE_SERVICE = 'com.locknest.device';
const ONBOARDING_SERVICE = 'com.locknest.onboarding';

const AUTHENTICATION_PROMPT = {
  title: 'Authenticate to access LockNest',
  cancel: 'Cancel',
};

export async function setSecureValue(
  service: string,
  username: string,
  value: string,
): Promise<void> {
  await Keychain.setGenericPassword(username, value, {
    service,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    authenticationPrompt: AUTHENTICATION_PROMPT,
  });
}

export async function getSecureValue(
  service: string,
): Promise<string | null> {
  const result = await Keychain.getGenericPassword({
    service,
    authenticationPrompt: AUTHENTICATION_PROMPT,
  });
  if (!result) {
    return null;
  }
  return result.password;
}

export async function deleteSecureValue(service: string): Promise<void> {
  await Keychain.resetGenericPassword({service});
}

export const secureKeys = {
  PASSCODE_SERVICE,
  DEVICE_SERVICE,
  ONBOARDING_SERVICE,
};
