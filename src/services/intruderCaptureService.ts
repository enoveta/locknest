import {NativeModules, PermissionsAndroid, Platform} from 'react-native';
import {
  getLatestIntruderEvidence,
  markOldEvidenceDeleted,
} from '../database/repositories/securityRepository';
import {recordIntruderEvidence} from './securityService';
import {
  cameraPermissionMessage,
  cameraUnavailableMessage,
} from '../utils/unlockPolicy';

const KEEP_PHOTOS = 5;

export type IntruderCaptureResult = {
  photoPath?: string;
  cameraError?: string;
};

export async function captureIntruderPhoto(
  eventId: number,
): Promise<IntruderCaptureResult> {
  if (Platform.OS !== 'android' || !NativeModules.IntruderCamera) {
    return {cameraError: cameraUnavailableMessage()};
  }

  const permission = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
    return {cameraError: cameraPermissionMessage()};
  }

  try {
    const filePath = await NativeModules.IntruderCamera.captureFrontPhoto();
    await recordIntruderEvidence(eventId, filePath);
    await cleanupOldIntruderPhotos();
    return {photoPath: filePath};
  } catch {
    return {cameraError: cameraUnavailableMessage()};
  }
}

export async function cleanupOldIntruderPhotos(): Promise<void> {
  try {
    if (Platform.OS === 'android' && NativeModules.IntruderCamera?.cleanupOldPhotos) {
      await NativeModules.IntruderCamera.cleanupOldPhotos(KEEP_PHOTOS);
    }
    const extraPaths = await markOldEvidenceDeleted(KEEP_PHOTOS);
    if (Platform.OS === 'android' && NativeModules.IntruderCamera?.deletePhoto) {
      await Promise.all(
        extraPaths.map(path => NativeModules.IntruderCamera.deletePhoto(path).catch(() => null)),
      );
    }
  } catch {
    // Cleanup is best-effort and must not block the unlock flow.
  }
}

export async function loadLatestIntruderPhoto(
  userId: number,
): Promise<string | undefined> {
  const evidence = await getLatestIntruderEvidence(userId);
  return evidence?.file_path;
}
