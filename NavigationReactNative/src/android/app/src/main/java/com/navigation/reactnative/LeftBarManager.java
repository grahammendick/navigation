package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class LeftBarManager extends ViewGroupManager<LeftBarView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVLeftBar";
    }

    @Nonnull
    @Override
    protected LeftBarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new LeftBarView(reactContext);
    }
}
