package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class DrawerManager extends ViewGroupManager<DrawerView> {
    @NonNull
    @Override
    public String getName() {
        return "NVDrawer";
    }

    @NonNull
    @Override
    protected DrawerView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new DrawerView(themedReactContext);
    }
}
