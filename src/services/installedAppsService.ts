import {NativeModules, Platform} from 'react-native';
import {installedAppsUnavailableMessage} from '../utils/unlockPolicy';

export type InstalledApp = {
  packageName: string;
  appName: string;
};

function installedAppsModule() {
  if (Platform.OS !== 'android' || !NativeModules.InstalledApps) {
    return null;
  }
  return NativeModules.InstalledApps;
}

export function isInstalledAppsBridgeAvailable(): boolean {
  return installedAppsModule() != null;
}

export async function listInstalledApps(): Promise<InstalledApp[]> {
  const native = installedAppsModule();
  if (!native) {
    return [];
  }
  return native.listLaunchableApps();
}

export async function listInstalledAppsOrThrow(): Promise<InstalledApp[]> {
  const native = installedAppsModule();
  if (!native) {
    throw new Error(installedAppsUnavailableMessage());
  }
  return native.listLaunchableApps();
}

export async function syncLockedPackages(packages: string[]): Promise<void> {
  const native = installedAppsModule();
  if (native) {
    await native.setLockedPackages(packages);
  }
}

export async function syncAccessPolicy(
  mode: 'guest' | 'stay' | null,
  allowedPackages: string[],
): Promise<void> {
  const native = installedAppsModule();
  if (native) {
    await native.setAccessPolicy(mode, allowedPackages);
  }
}

export function openAccessibilitySettings(): void {
  installedAppsModule()?.openAccessibilitySettings();
}

export async function getPendingLockedPackage(): Promise<string | null> {
  const native = installedAppsModule();
  if (!native) {
    return null;
  }
  return native.getPendingLockedPackage();
}

export function clearPendingLockedPackage(): void {
  installedAppsModule()?.clearPendingLockedPackage();
}

export async function openLockedPackage(packageName: string): Promise<void> {
  const native = installedAppsModule();
  if (!native?.openLockedPackage) {
    throw new Error('Unable to reopen the unlocked app.');
  }
  await native.openLockedPackage(packageName);
}
