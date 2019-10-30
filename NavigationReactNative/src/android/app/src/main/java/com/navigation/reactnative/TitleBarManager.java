package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class TitleBarManager extends ViewGroupManager<TitleBarView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVTitleBar";
    }

    @Nonnull
    @Override
    protected TitleBarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new TitleBarView(reactContext);
    }
}
