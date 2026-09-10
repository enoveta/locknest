import {NativeModules, Platform} from 'react-native';
import {
  clearPendingLockedPackage,
  isInstalledAppsBridgeAvailable,
  listInstalledApps,
  openLockedPackage,
} from '../src/services/installedAppsService';

describe('installedAppsService native bridge', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
    delete NativeModules.InstalledApps;
  });

  it('does not call native code when the Android bridge is missing', async () => {
    Platform.OS = 'android';
    expect(isInstalledAppsBridgeAvailable()).toBe(false);
    await expect(listInstalledApps()).resolves.toEqual([]);
    expect(() => clearPendingLockedPackage()).not.toThrow();
  });

  it('opens a locked package through the native module', async () => {
    const openLocked = jest.fn(async () => null);
    Platform.OS = 'android';
    NativeModules.InstalledApps = {
      openLockedPackage: openLocked,
    };

    await openLockedPackage('com.whatsapp');
    expect(openLocked).toHaveBeenCalledWith('com.whatsapp');
  });
});

describe('unlockSession', () => {
  it('keeps failed attempts after leaving the passcode screen', () => {
    const {
      recordSessionFailedAttempt,
      getSessionFailedAttempts,
      resetSessionFailedAttempts,
    } = require('../src/utils/unlockSession');
    resetSessionFailedAttempts();
    expect(recordSessionFailedAttempt()).toBe(1);
    expect(recordSessionFailedAttempt()).toBe(2);
    expect(getSessionFailedAttempts()).toBe(2);
    resetSessionFailedAttempts();
    expect(getSessionFailedAttempts()).toBe(0);
  });
});
