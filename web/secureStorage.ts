const prefix = 'locknest.web.';

export async function setSecureValue(
  service: string,
  _username: string,
  value: string,
): Promise<void> {
  localStorage.setItem(`${prefix}${service}`, value);
}

export async function getSecureValue(service: string): Promise<string | null> {
  return localStorage.getItem(`${prefix}${service}`);
}

export async function deleteSecureValue(service: string): Promise<void> {
  localStorage.removeItem(`${prefix}${service}`);
}

export const secureKeys = {
  PASSCODE_SERVICE: 'com.locknest.passcode',
  DEVICE_SERVICE: 'com.locknest.device',
  ONBOARDING_SERVICE: 'com.locknest.onboarding',
};
