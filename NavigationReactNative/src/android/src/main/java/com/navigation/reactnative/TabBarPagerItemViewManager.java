package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.viewmanagers.NVTabBarPagerItemManagerInterface;

public class TabBarPagerItemViewManager extends TabBarItemViewManager implements NVTabBarPagerItemManagerInterface<TabBarItemView> {
    @NonNull
    @Override
    public String getName() {
        return "NVTabBarPagerItem";
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
}
