package com.locknest

import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap

class InstalledAppsModule(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {
  override fun getName(): String = "InstalledApps"

  @ReactMethod
  fun listLaunchableApps(promise: Promise) {
    try {
      val intent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
      val apps = reactApplicationContext.packageManager
        .queryIntentActivities(intent, 0)
        .mapNotNull { resolveInfo ->
          val packageName = resolveInfo.activityInfo?.packageName ?: return@mapNotNull null
          if (packageName == reactApplicationContext.packageName) return@mapNotNull null
          packageName to resolveInfo.loadLabel(reactApplicationContext.packageManager).toString()
        }
        .distinctBy { it.first }
        .sortedBy { it.second.lowercase() }

      val result = WritableNativeArray()
      apps.forEach { (packageName, label) ->
        result.pushMap(WritableNativeMap().apply {
          putString("packageName", packageName)
          putString("appName", label)
        })
      }
      promise.resolve(result)
    } catch (error: Exception) {
      promise.reject("INSTALLED_APPS_ERROR", "Unable to read installed apps", error)
    }
  }

  @ReactMethod
  fun setLockedPackages(packages: ReadableArray, promise: Promise) {
    val values = packages.toStringSet()
    preferences().edit()
      .putStringSet(AppLockAccessibilityService.LOCKED_PACKAGES, values)
      .apply()
    promise.resolve(null)
  }

  @ReactMethod
  fun setAccessPolicy(mode: String?, packages: ReadableArray, promise: Promise) {
    preferences().edit()
      .putString(AppLockAccessibilityService.ACCESS_MODE, mode)
      .putStringSet(AppLockAccessibilityService.ALLOWED_PACKAGES, packages.toStringSet())
      .apply()
    promise.resolve(null)
  }

  @ReactMethod
  fun openAccessibilitySettings() {
    reactApplicationContext.startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    })
  }

  @ReactMethod
  fun openLockedPackage(packageName: String, promise: Promise) {
    try {
      val launchIntent = reactApplicationContext.packageManager
        .getLaunchIntentForPackage(packageName)
      if (launchIntent == null) {
        promise.reject("APP_LAUNCH_FAILED", "Unable to open the unlocked app")
        return
      }
      preferences().edit()
        .putString(AppLockAccessibilityService.UNLOCKED_PACKAGE, packageName)
        .remove(AppLockAccessibilityService.PENDING_PACKAGE)
        .apply()
      launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      reactApplicationContext.startActivity(launchIntent)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("APP_LAUNCH_FAILED", "Unable to open the unlocked app", error)
    }
  }

  @ReactMethod
  fun markPackageUnlocked(packageName: String, promise: Promise) {
    preferences().edit()
      .putString(AppLockAccessibilityService.UNLOCKED_PACKAGE, packageName)
      .apply()
    promise.resolve(null)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun getPendingLockedPackage(): String? =
    preferences().getString(AppLockAccessibilityService.PENDING_PACKAGE, null)

  @ReactMethod
  fun clearPendingLockedPackage() {
    preferences().edit().remove(AppLockAccessibilityService.PENDING_PACKAGE).apply()
  }

  private fun preferences() = reactApplicationContext.getSharedPreferences(
    AppLockAccessibilityService.PREFS,
    android.content.Context.MODE_PRIVATE,
  )

  private fun ReadableArray.toStringSet(): Set<String> = buildSet {
    for (index in 0 until size()) {
      getString(index)?.let(::add)
    }
  }
}
