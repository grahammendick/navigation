package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class StatusBarManager extends ViewGroupManager<StatusBarView> {
    @Override
    public String getName() {
        return "NVStatusBar";
    }

    @Override
    protected StatusBarView createViewInstance(ThemedReactContext reactContext) {
        return new StatusBarView(reactContext);
    }
}
