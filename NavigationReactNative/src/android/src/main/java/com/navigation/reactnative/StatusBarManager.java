package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class StatusBarManager extends ViewGroupManager<StatusBarView> {
    @Override
    public String getName() {
        return "NVStatusBar";
    }

    @Override
    protected StatusBarView createViewInstance(ThemedReactContext reactContext) {
        return new StatusBarView(reactContext);
    }

    @ReactProp(name = "hidden")
    public void setHidden(StatusBarView view, boolean hidden) {
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull StatusBarView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }
}
