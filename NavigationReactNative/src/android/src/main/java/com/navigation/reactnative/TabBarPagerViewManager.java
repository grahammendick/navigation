package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVTabBarPagerManagerDelegate;
import com.facebook.react.viewmanagers.NVTabBarPagerManagerInterface;

import java.util.Map;

import javax.annotation.Nonnull;

public class TabBarPagerViewManager extends ViewGroupManager<TabBarPagerView> implements NVTabBarPagerManagerInterface<TabBarPagerView> {
    private final ViewManagerDelegate<TabBarPagerView> delegate;

    public TabBarPagerViewManager() {
        delegate = new NVTabBarPagerManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<TabBarPagerView> getDelegate() {
        return delegate;
    }

    @Nonnull
    @Override
    public String getName() {
        return "NVTabBarPager";
    }

    @Nonnull
    @Override
    protected TabBarPagerView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new TabBarPagerView(reactContext);
    }

    @ReactProp(name = "selectedTab")
    public void setSelectedTab(TabBarPagerView view, int selectedTab) {
        view.pendingSelectedTab = selectedTab;
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(TabBarPagerView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
        view.nativeEventCount = Math.max(view.nativeEventCount, view.mostRecentEventCount);
    }

    @Override
    @ReactProp(name = "tabCount")
    public void setTabCount(TabBarPagerView view, int tabCount) {
    }

    @ReactProp(name = "scrollsToTop")
    public void setScrollsToTop(TabBarPagerView view, boolean scrollsToTop) {
        view.scrollsToTop = scrollsToTop;
    }

    @Override
    public int getChildCount(TabBarPagerView parent) {
        return parent.getTabsCount();
    }

    @Override
    public View getChildAt(TabBarPagerView parent, int index) {
        return parent.getTabAt(index);
    }

    @Override
    public void addView(TabBarPagerView parent, View child, int index) {
        ((TabBarItemView) child).changeListener = parent;
        parent.addTab((TabBarItemView) child, index);
    }

    @Override
    public void removeViewAt(TabBarPagerView parent, int index) {
        parent.getTabAt(index).changeListener = null;
        parent.removeTab(index);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topTabSelected", MapBuilder.of("registrationName", "onTabSelected"))
            .put("topTabSwipeStateChanged", MapBuilder.of("registrationName", "onTabSwipeStateChanged"))
            .build();
    }

    @Override
    protected void onAfterUpdateTransaction(@Nonnull TabBarPagerView view) {
        super.onAfterUpdateTransaction(view);
        view.jsUpdate = true;
        view.onAfterUpdateTransaction();
        view.jsUpdate = false;
    }

    @Override
    public void onDropViewInstance(@NonNull TabBarPagerView view) {
        view.removeFragment();
        super.onDropViewInstance(view);
    }
}
