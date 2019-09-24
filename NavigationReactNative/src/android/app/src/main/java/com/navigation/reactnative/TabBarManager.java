package com.navigation.reactnative;

import android.view.View;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class TabBarManager extends ViewGroupManager<TabBarView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVTabBar";
    }

    @Nonnull
    @Override
    protected TabBarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new TabBarView(reactContext);
    }

    @Override
    public void addView(TabBarView parent, View child, int index) {
        parent.addViewToAdapter(child, index);
    }

}
