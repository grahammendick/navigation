package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVTabBarManagerDelegate;
import com.facebook.react.viewmanagers.NVTabBarManagerInterface;

import java.util.Map;

public class TabBarViewManager extends ViewGroupManager<TabBarView> implements NVTabBarManagerInterface<TabBarView> {
    private final ViewManagerDelegate<TabBarView> delegate;

    public TabBarViewManager() {
        delegate = new NVTabBarManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<TabBarView> getDelegate() {
        return delegate;
    }

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

    @Override
    public void setBarTintColor(TabBarView view, @Nullable Integer value) {
    }

    @Override
    public void setSelectedTintColor(TabBarView view, @Nullable Integer value) {
    }

    @Override
    public void setUnselectedTintColor(TabBarView view, @Nullable Integer value) {
    }

    @Override
    public void setBadgeColor(TabBarView view, @Nullable Integer value) {

    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(TabBarView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
    }

    @ReactProp(name = "tabCount")
    public void setTabCount(TabBarView view, int tabCount) {
    }

    @ReactProp(name = "scrollsToTop")
    public void setScrollsToTop(TabBarView view, boolean scrollsToTop) {
        view.scrollsToTop = scrollsToTop;
    }

    @Override
    public void setFontFamily(TabBarView view, @Nullable String value) {

    }

    @Override
    public void setFontWeight(TabBarView view, @Nullable String value) {

    }

    @Override
    public void setFontStyle(TabBarView view, @Nullable String value) {

    }

    @Override
    public void setFontSize(TabBarView view, float value) {

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
        parent.tabsChanged = true;
    }

    @Override
    public void removeViewAt(TabBarView parent, int index) {
        parent.tabFragments.get(index).tabBarItem.changeListener = null;
        parent.tabFragments.remove(index);
        parent.tabsChanged = true;
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull TabBarView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }

    @Override
    public void onDropViewInstance(@NonNull TabBarView view) {
        view.removeFragment();
        super.onDropViewInstance(view);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topOnTabSelected", MapBuilder.of("registrationName", "onTabSelected"))
            .build();
    }
}
