package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class BottomAppBarManager extends ViewGroupManager<BottomAppBarView> {
    @NonNull
    @Override
    public String getName() {
        return "NVBottomAppBar";
    }

    @NonNull
    @Override
    protected BottomAppBarView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new BottomAppBarView(reactContext);
    }
}
