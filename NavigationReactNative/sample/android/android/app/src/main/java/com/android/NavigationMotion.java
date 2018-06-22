package com.android;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NavigationMotion extends ReactContextBaseJavaModule {

    public NavigationMotion(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NavigationMotion";
    }

    @ReactMethod
    public void render(int crumb) {
        Activity currentActivity = getCurrentActivity();
        Intent intent = new Intent(currentActivity, Scene.class);
        intent.putExtra("crumb", crumb);
        currentActivity.startActivity(intent);
    }
}
