export const DEFAULT_MAX_FAILED_ATTEMPTS = 3;
export const MAX_FAILED_ATTEMPT_OPTIONS = [3, 5, 10] as const;

export function remainingUnlockAttempts(
  failedAttempts: number,
  maxAttempts: number,
): number {
  return Math.max(0, maxAttempts - failedAttempts);
}

export function shouldCaptureIntruder(
  failedAttempts: number,
  maxAttempts: number,
): boolean {
  return failedAttempts >= maxAttempts;
}

export function wrongPasscodeMessage(
  failedAttempts: number,
  maxAttempts: number,
): string {
  const remaining = remainingUnlockAttempts(failedAttempts, maxAttempts);
  if (remaining <= 0) {
    return 'Too many wrong passcodes. Access stays blocked.';
  }
  return `Wrong passcode. ${remaining} ${remaining === 1 ? 'try' : 'tries'} left.`;
}

export function cameraPermissionMessage(): string {
  return 'Camera permission is required to capture an intruder photo.';
}

export function cameraUnavailableMessage(): string {
  return 'Intruder photo could not be captured. The unlock stays blocked.';
}

export function accessibilityHelpText(): string {
  return 'LockNest cannot turn on Accessibility by itself. Enable LockNest in Android Settings > Accessibility to block locked apps.';
}

export function installedAppsUnavailableMessage(): string {
  return 'Installed apps are unavailable. Use a real Android device and allow LockNest to read launchable apps.';
}

export function toFileUri(path: string): string {
  return path.startsWith('file:') ? path : `file://${path}`;
}
