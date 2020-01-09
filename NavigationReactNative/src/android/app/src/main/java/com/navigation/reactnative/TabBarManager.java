package com.navigation.reactnative;

import android.view.View;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

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

    @ReactProp(name = "selectedTab")
    public void setSelectedTab(TabBarView view, int selectedTab) {
        if (view.getCurrentItem() != selectedTab) {
            view.setCurrentItem(selectedTab, false);
        }
    }

    @ReactProp(name = "images")
    public void setImages(TabBarView view, ReadableArray images) {
    }

    @ReactProp(name = "swipeable")
    public void setSwipeable(TabBarView view, boolean swipeable) {
        view.swipeable = swipeable;
    }

    @Override
    public int getChildCount(TabBarView parent) {
        return parent.getTabsCount();
    }

    @Override
    public View getChildAt(TabBarView parent, int index) {
        return parent.getTabAt(index);
    }

    @Override
    public void addView(TabBarView parent, View child, int index) {
        parent.addTab((TabBarItemView) child, index);
    }

    @Override
    public void removeViewAt(TabBarView parent, int index) {
        parent.removeTab(index);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onTabSelected", MapBuilder.of("registrationName", "onTabSelected"))
                .build();
    }

    @Override
    protected void onAfterUpdateTransaction(@Nonnull TabBarView view) {
        super.onAfterUpdateTransaction(view);
        view.populateTabIcons();

    }
}
