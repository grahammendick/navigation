package com.navigation.reactnative;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.util.HashMap;

public class NavigationModule extends ReactContextBaseJavaModule {
    private HashMap<Integer, Intent> mIntents = new HashMap<>();

    public NavigationModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NavigationModule";
    }

    @ReactMethod
    public void render(int crumb, int tab, ReadableArray titles, String appKey) {
        Activity currentActivity = getCurrentActivity();
        if (mIntents.size() == 0) {
            mIntents.put(0, currentActivity.getIntent());
        }
        int currentCrumb = mIntents.size() - 1;
        if (crumb < currentCrumb) {
            currentActivity.navigateUpTo(mIntents.get(crumb));
            for(int i = crumb + 1; i <= currentCrumb; i++) {
                mIntents.remove(i);
            }
        }
        if (crumb > currentCrumb) {
            Intent[] intents = new Intent[crumb - currentCrumb];
            for(int i = 0; i < crumb - currentCrumb; i++) {
                int nextCrumb = currentCrumb + i + 1;
                Class scene = nextCrumb % 2 == 0 ? SceneActivity.class : AlternateSceneActivity.class;
                Intent intent = new Intent(getReactApplicationContext(), scene);
                intent.putExtra(SceneActivity.CRUMB, nextCrumb);
                intent.putExtra(SceneActivity.APP_KEY, appKey);
                mIntents.put(nextCrumb, intent);
                intents[i] = intent;
            }
            currentActivity.startActivities(intents);
        }
    }
}

