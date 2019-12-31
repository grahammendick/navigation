package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class TabNavigationManager extends ViewGroupManager<TabNavigationView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVTabNavigation";
    }

    @Nonnull
    @Override
    protected TabNavigationView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new TabNavigationView(reactContext);
    }
}
