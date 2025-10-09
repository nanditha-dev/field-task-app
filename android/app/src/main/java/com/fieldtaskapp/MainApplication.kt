package com.fieldtaskapp

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.shell.MainReactPackage
import com.facebook.react.defaults.DefaultReactNativeHost

class MainApplication : Application(), ReactApplication {

    private val mReactNativeHost: ReactNativeHost = object : DefaultReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override fun getPackages(): List<ReactPackage> {
            return listOf(
                MainReactPackage()
                // Add other packages manually here, like:
                // MyCustomPackage(),
                // VectorIconsPackage(),
                // etc.
            )
        }

        override fun getJSMainModuleName(): String = "index"
    }

    override val reactNativeHost: ReactNativeHost
        get() = mReactNativeHost
}
