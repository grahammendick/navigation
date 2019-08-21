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
        if (getReactContext() == null) {
            Intent mainIntent = getApplicationContext().getPackageManager().getLaunchIntentForPackage(getApplicationContext().getPackageName());
            mainIntent.setData(uri);
            startActivity(mainIntent);
        } else {
            DeviceEventManagerModule deviceEventManagerModule = getReactContext().getNativeModule(DeviceEventManagerModule.class);
            deviceEventManagerModule.emitNewIntentReceived(uri);
        }
        finish();
    }

    private ReactContext getReactContext() {
        return ((ReactApplication) getApplication()).getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
    }
}
