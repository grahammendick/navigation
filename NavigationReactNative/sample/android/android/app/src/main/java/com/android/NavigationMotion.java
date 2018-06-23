package com.android;

import android.app.Activity;
import android.content.Intent;

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
            currentActivity.navigateUpTo(mIntents.get(crumb));
            for(int i = crumb + 1; i <= currentCrumb; i++) {
                mIntents.remove(i);
            }
        }
        if (crumb > currentCrumb) {
            Intent[] intents = new Intent[crumb - currentCrumb];
            for(int i = 0; i < crumb - currentCrumb; i++) {
                Intent intent = new Intent(getReactApplicationContext(), Scene.class);
                intent.putExtra("crumb", currentCrumb + i + 1);
                mIntents.put(currentCrumb + i + 1, intent);
                intents[i] = intent;
            }
            currentActivity.startActivities(intents);
        }
    }
}
