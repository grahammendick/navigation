package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class ActionBarManager extends ViewGroupManager<ActionBarView> {
    @NonNull
    @Override
    public String getName() {
        return "NVActionBar";
    }

    @NonNull
    @Override
    protected ActionBarView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new ActionBarView(reactContext);
    }
}
