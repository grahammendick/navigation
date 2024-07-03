package com.navigation.reactnative;

import androidx.annotation.NonNull;

public class TabBarPagerItemManager extends TabBarItemManager {
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
