package com.navigation.reactnative;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVNavigationBarManagerDelegate;
import com.facebook.react.viewmanagers.NVNavigationBarManagerInterface;
import com.facebook.react.viewmanagers.NVStatusBarManagerDelegate;
import com.facebook.react.viewmanagers.NVStatusBarManagerInterface;

import javax.annotation.Nonnull;

@ReactModule(name = "NVStatusBar")
public class StatusBarViewManager extends ViewGroupManager<StatusBarView> implements NVStatusBarManagerInterface<StatusBarView> {
    private final ViewManagerDelegate<StatusBarView> delegate;

    public StatusBarViewManager() {
        delegate = new NVStatusBarManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<StatusBarView> getDelegate() {
        return delegate;
    }

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
        view.hidden = hidden;
    }

    @ReactProp(name = "tintStyle")
    public void setTintStyle(StatusBarView view, String tintStyle) {
        view.tintStyle = tintStyle;
    }

    @Override
    public void setBarTintColor(StatusBarView view, @Nullable Integer barTintColor) {
        view.barTintColor = barTintColor != null ? barTintColor : view.defaultStatusBarColor;
    }

    /* @ReactProp(name = "barTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBarTintColor(StatusBarView view, int barTintColor) {
        view.barTintColor = barTintColor != Integer.MAX_VALUE ? barTintColor : view.defaultStatusBarColor;
    } */

    @Override
    protected void onAfterUpdateTransaction(@NonNull StatusBarView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }
}
