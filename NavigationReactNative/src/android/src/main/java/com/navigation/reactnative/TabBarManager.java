package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class TabBarManager extends ViewGroupManager<TabBarView> {

    @NonNull
    @Override
    public String getName() {
        return "NVTabBar";
    }

    @NonNull
    @Override
    protected TabBarView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new TabBarView(reactContext);
    }
}
