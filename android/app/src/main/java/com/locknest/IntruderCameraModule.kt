package com.locknest

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.ImageFormat
import android.hardware.camera2.CameraCaptureSession
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraDevice
import android.hardware.camera2.CameraManager
import android.media.ImageReader
import android.os.Handler
import android.os.HandlerThread
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileOutputStream

class IntruderCameraModule(private val context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {
  override fun getName(): String = "IntruderCamera"

  @ReactMethod
  fun captureFrontPhoto(promise: Promise) {
    if (ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) !=
        PackageManager.PERMISSION_GRANTED) {
      promise.reject("CAMERA_PERMISSION_REQUIRED", "Camera permission is required")
      return
    }

    val cameraManager = context.getSystemService(CameraManager::class.java)
    val cameraId = cameraManager.cameraIdList.firstOrNull { id ->
      cameraManager.getCameraCharacteristics(id)
        .get(CameraCharacteristics.LENS_FACING) == CameraCharacteristics.LENS_FACING_FRONT
    } ?: run {
      promise.reject("NO_FRONT_CAMERA", "No front camera is available")
      return
    }

    val thread = HandlerThread("locknest-intruder-camera").apply { start() }
    val handler = Handler(thread.looper)
    val reader = ImageReader.newInstance(640, 480, ImageFormat.JPEG, 1)
    val output = File(context.filesDir, "intruder").apply { mkdirs() }
    val photo = File(output, "intruder-${System.currentTimeMillis()}.jpg")
    var camera: CameraDevice? = null
    var session: CameraCaptureSession? = null

    fun finish() {
      session?.close()
      camera?.close()
      reader.close()
      thread.quitSafely()
    }

    reader.setOnImageAvailableListener({ imageReader ->
      try {
        imageReader.acquireLatestImage()?.use { image ->
          FileOutputStream(photo).use { stream ->
            val buffer = image.planes[0].buffer
            val bytes = ByteArray(buffer.remaining())
            buffer.get(bytes)
            stream.write(bytes)
          }
        }
        promise.resolve(photo.absolutePath)
      } catch (error: Exception) {
        promise.reject("INTRUDER_CAPTURE_FAILED", "Unable to save intruder photo", error)
      } finally {
        finish()
      }
    }, handler)

    try {
      cameraManager.openCamera(cameraId, object : CameraDevice.StateCallback() {
        override fun onOpened(device: CameraDevice) {
          camera = device
          device.createCaptureSession(
            listOf(reader.surface),
            object : CameraCaptureSession.StateCallback() {
              override fun onConfigured(configured: CameraCaptureSession) {
                session = configured
                val request = device.createCaptureRequest(CameraDevice.TEMPLATE_STILL_CAPTURE).apply {
                  addTarget(reader.surface)
                }.build()
                configured.capture(request, null, handler)
              }

              override fun onConfigureFailed(failed: CameraCaptureSession) {
                finish()
                promise.reject("INTRUDER_CAPTURE_FAILED", "Unable to configure camera")
              }
            },
            handler,
          )
        }

        override fun onDisconnected(device: CameraDevice) {
          device.close()
          finish()
          promise.reject("INTRUDER_CAMERA_DISCONNECTED", "Camera disconnected")
        }

        override fun onError(device: CameraDevice, error: Int) {
          device.close()
          finish()
          promise.reject("INTRUDER_CAMERA_ERROR", "Camera error: $error")
        }
      }, handler)
    } catch (error: SecurityException) {
      finish()
      promise.reject("CAMERA_PERMISSION_REQUIRED", "Camera permission is required", error)
    } catch (error: Exception) {
      finish()
      promise.reject("INTRUDER_CAPTURE_FAILED", "Unable to open camera", error)
    }
  }

  @ReactMethod
  fun cleanupOldPhotos(keepCount: Double, promise: Promise) {
    try {
      val dir = File(context.filesDir, "intruder")
      val files = dir.listFiles()?.sortedByDescending { it.lastModified() }.orEmpty()
      val keep = keepCount.toInt().coerceAtLeast(0)
      files.drop(keep).forEach { file -> file.delete() }
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("INTRUDER_CLEANUP_FAILED", "Unable to clean up intruder photos", error)
    }
  }

  @ReactMethod
  fun deletePhoto(path: String, promise: Promise) {
    try {
      File(path).takeIf { it.exists() }?.delete()
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("INTRUDER_DELETE_FAILED", "Unable to delete intruder photo", error)
    }
  }
}
