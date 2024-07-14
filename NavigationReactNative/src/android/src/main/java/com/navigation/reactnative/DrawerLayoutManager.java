package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class DrawerLayoutManager extends ViewGroupManager<DrawerLayoutView> {
    @NonNull
    @Override
    public String getName() {
        return "NVDrawerLayout";
    }

    @ReactProp(name = "open")
    public void setOpen(DrawerLayoutView view, boolean open) {
        view.pendingOpen = open;
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(DrawerLayoutView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull DrawerLayoutView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }

    @NonNull
    @Override
    protected DrawerLayoutView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new DrawerLayoutView(themedReactContext);
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
}
