package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class RightBarManager extends ViewGroupManager<RightBarView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVRightBar";
    }

    @Nonnull
    @Override
    protected RightBarView createViewInstance(ThemedReactContext reactContext) {
        return new RightBarView(reactContext);
    }
}
