package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

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

    @ReactProp(name = "image")
    public void setImage(ExtendedFloatingActionButtonView view, ReadableMap icon) {
        view.setIconSource(icon);
    }
}
