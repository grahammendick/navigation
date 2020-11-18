package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nonnull;

public class StatusBarManager extends ViewGroupManager<StatusBarView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVStatusBar";
    }

    @Nonnull
    @Override
    protected StatusBarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
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
