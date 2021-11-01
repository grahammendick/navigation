package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;

public class FreezeManager extends ViewGroupManager<ReactViewGroup> {
    @NonNull
    @Override
    public String getName() {
        return "NVFreeze";
    }

    @ReactProp(name = "display")
    public void setDisplay(ReactViewGroup view, String display) {
    }

    @NonNull
    @Override
    protected ReactViewGroup createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new ReactViewGroup(reactContext);
    }
}
