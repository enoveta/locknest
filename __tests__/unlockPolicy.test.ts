import {
  remainingUnlockAttempts,
  shouldCaptureIntruder,
  wrongPasscodeMessage,
  cameraPermissionMessage,
  accessibilityHelpText,
  installedAppsUnavailableMessage,
  toFileUri,
} from '../src/utils/unlockPolicy';

describe('unlockPolicy', () => {
  it('counts remaining attempts and triggers capture at the limit', () => {
    expect(remainingUnlockAttempts(1, 3)).toBe(2);
    expect(shouldCaptureIntruder(2, 3)).toBe(false);
    expect(shouldCaptureIntruder(3, 3)).toBe(true);
    expect(shouldCaptureIntruder(5, 5)).toBe(true);
  });

  it('keeps the user blocked after too many wrong passcodes', () => {
    expect(wrongPasscodeMessage(3, 3)).toContain('blocked');
    expect(wrongPasscodeMessage(1, 3)).toContain('2 tries left');
  });

  it('explains camera, accessibility, and installed-app failures', () => {
    expect(cameraPermissionMessage()).toContain('Camera permission');
    expect(accessibilityHelpText()).toContain('Accessibility');
    expect(installedAppsUnavailableMessage()).toContain('Installed apps');
  });

  it('converts private photo paths to file URIs', () => {
    expect(toFileUri('/data/user/0/com.locknest/files/intruder/a.jpg')).toBe(
      'file:///data/user/0/com.locknest/files/intruder/a.jpg',
    );
    expect(toFileUri('file:///tmp/photo.jpg')).toBe('file:///tmp/photo.jpg');
  });
});
