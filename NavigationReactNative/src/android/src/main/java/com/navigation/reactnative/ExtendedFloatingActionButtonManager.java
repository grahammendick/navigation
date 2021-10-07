package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

public class ExtendedFloatingActionButtonManager extends SimpleViewManager<ExtendedFloatingActionButtonView> {
    @NonNull
    @Override
    public String getName() {
        return "NVExtendedFloatingActionButton";
    }

    @NonNull
    @Override
    protected ExtendedFloatingActionButtonView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new ExtendedFloatingActionButtonView(reactContext);
    }
}
