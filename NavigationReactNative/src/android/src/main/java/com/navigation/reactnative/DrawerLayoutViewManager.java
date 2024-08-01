package com.navigation.reactnative;

import android.view.Gravity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.NVDrawerLayoutManagerDelegate;
import com.facebook.react.viewmanagers.NVDrawerLayoutManagerInterface;

import java.util.Map;

public class DrawerLayoutViewManager extends ViewGroupManager<DrawerLayoutView> implements NVDrawerLayoutManagerInterface<DrawerLayoutView> {
    private final ViewManagerDelegate<DrawerLayoutView> delegate;

    public DrawerLayoutViewManager() {
        delegate = new NVDrawerLayoutManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<DrawerLayoutView> getDelegate() {
        return delegate;
    }

    @NonNull
    @Override
    public String getName() {
        return "NVDrawerLayout";
    }

    @NonNull
    @Override
    protected DrawerLayoutView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new DrawerLayoutView(themedReactContext);
    }

    @Override
    public void setOpen(DrawerLayoutView view, boolean open) {
        view.pendingOpen = open;
    }

    @Override
    public void setFromRight(DrawerLayoutView view, boolean fromRight) {
        view.gravity = !fromRight ? Gravity.LEFT : Gravity.RIGHT;
        view.requestLayout();
    }

    @Override
    public void setMostRecentEventCount(DrawerLayoutView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topChangeOpen", MapBuilder.of("registrationName", "onChangeOpen"))
            .build();
    }
}
