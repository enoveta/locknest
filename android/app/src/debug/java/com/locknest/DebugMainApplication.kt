package com.locknest

class DebugMainApplication : MainApplication() {
  override fun onCreate() {
    DebugMetroHost.apply(this)
    super.onCreate()
  }
}
