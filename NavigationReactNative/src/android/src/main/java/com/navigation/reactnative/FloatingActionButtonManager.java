package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

public class FloatingActionButtonManager extends SimpleViewManager<FloatingActionButtonView> {
    @NonNull
    @Override
    public String getName() {
        return "NVFloatingActionButton";
    }

    @NonNull
    @Override
    protected FloatingActionButtonView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new FloatingActionButtonView(reactContext);
    }
}
