package com.zoom;

import android.net.Uri;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Uri uri = getIntent().getData();
        if (uri != null) {
            ReactContext currentContext = getReactInstanceManager().getCurrentReactContext();
            DeviceEventManagerModule deviceEventManagerModule =
                currentContext.getNativeModule(DeviceEventManagerModule.class);
            deviceEventManagerModule.emitNewIntentReceived(uri);
        }
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "zoom";
    }
}
