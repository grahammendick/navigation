package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class CoordinatorLayoutManager extends ViewGroupManager<CoordinatorLayoutView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVCoordinatorLayout";
    }

    @Nonnull
    @Override
    protected CoordinatorLayoutView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new CoordinatorLayoutView(reactContext);
    }
}
