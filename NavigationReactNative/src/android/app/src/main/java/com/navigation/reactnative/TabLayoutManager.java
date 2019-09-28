package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class TabLayoutManager extends ViewGroupManager<TabLayoutView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVTabLayout";
    }

    @Nonnull
    @Override
    protected TabLayoutView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new TabLayoutView(reactContext);
    }
}
