package com.navigation.reactnative;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class LinkActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent intent = getIntent();
        Uri uri = intent.getData();
        ReactContext reactContext = ((ReactApplication) getApplication()).getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
        if (reactContext == null || reactContext.getCurrentActivity() == null) {
            Intent mainIntent = getApplicationContext().getPackageManager().getLaunchIntentForPackage(getApplicationContext().getPackageName());
            if (mainIntent != null) {
                mainIntent.setData(uri);
                startActivity(mainIntent);
            }
        } else {
            if (uri != null) {
                DeviceEventManagerModule deviceEventManagerModule = reactContext.getNativeModule(DeviceEventManagerModule.class);
                deviceEventManagerModule.emitNewIntentReceived(uri);
            }
        }
        finish();
    }
}
