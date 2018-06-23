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
                int intentCrumb = currentCrumb + i + 1;
                Class scene = intentCrumb % 2 == 0 ? EvenScene.class : OddScene.class;
                Intent intent = new Intent(getReactApplicationContext(), scene);
                intent.putExtra("crumb", intentCrumb);
                mIntents.put(intentCrumb, intent);
                intents[i] = intent;
            }
            currentActivity.startActivities(intents);
        }
    }
}
