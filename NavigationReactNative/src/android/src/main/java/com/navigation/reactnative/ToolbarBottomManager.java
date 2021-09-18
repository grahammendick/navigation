package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class ToolbarBottomManager extends ViewGroupManager<ToolbarBottomView> {
    @NonNull
    @Override
    public String getName() {
        return "NVToolbarBottom";
    }

    @NonNull
    @Override
    protected ToolbarBottomView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new ToolbarBottomView(reactContext);
    }
}
