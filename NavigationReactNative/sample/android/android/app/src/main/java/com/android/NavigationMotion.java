package com.android;

import android.app.Activity;
import android.content.Intent;
import android.support.v4.app.NavUtils;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;

public class NavigationMotion extends ReactContextBaseJavaModule {

    private HashMap<Integer, Intent> mIntents = new HashMap<>();

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
        if (mIntents.size() == 0) {
            mIntents.put(0, currentActivity.getIntent());
        }
        int currentCrumb = currentActivity.getIntent().getIntExtra("crumb", 0);
        if (crumb < currentCrumb) {
            NavUtils.navigateUpTo(currentActivity, mIntents.get(crumb));
            for(int i = crumb + 1; i <= currentCrumb; i++) {
                mIntents.remove(i);
            }
        }
        if (crumb > currentCrumb) {
            Intent intent = new Intent(getReactApplicationContext(), Scene.class);
            intent.putExtra("crumb", crumb);
            currentActivity.startActivity(intent);
            mIntents.put(crumb, intent);
        }
    }
}
