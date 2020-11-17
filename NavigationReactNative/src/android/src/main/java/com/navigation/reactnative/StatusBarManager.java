package com.navigation.reactnative;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

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

    @ReactProp(name = "barTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBarTintColor(StatusBarView view, int barTintColor) {
        view.barTintColor = barTintColor;
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull StatusBarView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }
}
