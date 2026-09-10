package com.locknest

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent

class AppLockAccessibilityService : AccessibilityService() {
  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    val packageName = event?.packageName?.toString() ?: return
    if (packageName == this.packageName) return

    val preferences = getSharedPreferences(PREFS, MODE_PRIVATE)
    val unlockedPackage = preferences.getString(UNLOCKED_PACKAGE, null)
    if (unlockedPackage != null && packageName == unlockedPackage) {
      return
    }
    if (unlockedPackage != null && packageName != unlockedPackage) {
      preferences.edit().remove(UNLOCKED_PACKAGE).apply()
    }

    val lockedPackages = preferences
      .getStringSet(LOCKED_PACKAGES, emptySet())
      .orEmpty()
    val accessMode = preferences.getString(ACCESS_MODE, null)
    val allowedPackages = preferences.getStringSet(ALLOWED_PACKAGES, emptySet()).orEmpty()
    val shouldBlock = packageName in lockedPackages ||
      (accessMode != null && packageName !in allowedPackages)
    if (!shouldBlock) return

    val now = System.currentTimeMillis()
    val lastPrompt = getSharedPreferences(PREFS, MODE_PRIVATE).getLong(LAST_PROMPT, 0)
    if (now - lastPrompt < PROMPT_COOLDOWN_MS) return

    getSharedPreferences(PREFS, MODE_PRIVATE).edit().putLong(LAST_PROMPT, now).apply()
    getSharedPreferences(PREFS, MODE_PRIVATE).edit()
      .putString(PENDING_PACKAGE, packageName)
      .apply()
    startActivity(Intent(this, MainActivity::class.java).apply {
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
      putExtra(EXTRA_LOCKED_PACKAGE, packageName)
    })
  }

  override fun onInterrupt() = Unit

  companion object {
    const val PREFS = "locknest.app_lock"
    const val LOCKED_PACKAGES = "locked_packages"
    const val LAST_PROMPT = "last_prompt"
    const val PENDING_PACKAGE = "pending_package"
    const val UNLOCKED_PACKAGE = "unlocked_package"
    const val ACCESS_MODE = "access_mode"
    const val ALLOWED_PACKAGES = "access_allowed_packages"
    const val EXTRA_LOCKED_PACKAGE = "locked_package"
    private const val PROMPT_COOLDOWN_MS = 1_500L
  }
}
