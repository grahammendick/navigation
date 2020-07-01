package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class TabBarManager extends ViewGroupManager<TabBarView> {

    @NonNull
    @Override
    public String getName() {
        return "NVTabBar";
    }

    @NonNull
    @Override
    protected TabBarView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new TabBarView(reactContext);
    }

    @ReactProp(name = "selectedTab")
    public void setSelectedTab(TabBarView view, int selectedTab) {
        int eventLag = view.nativeEventCount - view.mostRecentEventCount;
        if (eventLag == 0 && view.selectedTab != selectedTab) {
            view.selectedTab = selectedTab;
            if (view.tabFragments.size() > selectedTab)
                view.setCurrentTab(selectedTab);
        }
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(TabBarPagerView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
    }

    @Override
    public int getChildCount(TabBarView parent) {
        return parent.tabFragments.size();
    }

    @Override
    public View getChildAt(TabBarView parent, int index) {
        return parent.tabFragments.get(index).tabBarItem;
    }

    @Override
    public void addView(TabBarView parent, View child, int index) {
        parent.tabFragments.add(index, new TabFragment((TabBarItemView) child));
    }

    @Override
    public void removeViewAt(TabBarView parent, int index) {
        parent.tabFragments.remove(index);
    }
}
