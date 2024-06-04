package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

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
        view.pendingSelectedTab = selectedTab;
    }

    @ReactProp(name = "preventFouc")
    public void setPreventFouc(TabBarView view, boolean preventFouc) {
        if (preventFouc && !view.preventFouc)
            view.foucCounter++;
        view.preventFouc = preventFouc;
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(TabBarView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
        view.nativeEventCount = Math.max(view.nativeEventCount, view.mostRecentEventCount);
    }

    @ReactProp(name = "tabCount")
    public void setTabCount(TabBarView view, int tabCount) {
    }

    @ReactProp(name = "scrollsToTop")
    public void setScrollsToTop(TabBarView view, boolean scrollsToTop) {
        view.scrollsToTop = scrollsToTop;
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
        ((TabBarItemView) child).changeListener = parent;
        parent.tabFragments.add(index, new TabFragment((TabBarItemView) child));
        parent.requestOnAfterUpdateTransaction();
    }

    @Override
    public void removeViewAt(TabBarView parent, int index) {
        parent.tabFragments.get(index).tabBarItem.changeListener = null;
        parent.tabFragments.remove(index);
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull TabBarView view) {
        super.onAfterUpdateTransaction(view);
        view.jsUpdate = true;
        view.onAfterUpdateTransaction();
        view.jsUpdate = false;
    }

    @Override
    public void onDropViewInstance(@NonNull TabBarView view) {
        view.removeFragment();
        super.onDropViewInstance(view);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topTabSelected", MapBuilder.of("registrationName", "onTabSelected"))
            .build();
    }
}
