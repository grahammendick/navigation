package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class DrawerLayoutManager extends ViewGroupManager<DrawerLayoutView> {
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
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
}
