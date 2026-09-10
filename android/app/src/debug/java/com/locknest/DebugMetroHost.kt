package com.locknest

import android.app.Application
import android.preference.PreferenceManager

object DebugMetroHost {
  fun apply(app: Application) {
    val host = BuildConfig.METRO_HOST
    if (host.isBlank()) {
      return
    }
    PreferenceManager.getDefaultSharedPreferences(app)
        .edit()
        .putString("debug_http_host", "$host:8081")
        .apply()
  }
}
