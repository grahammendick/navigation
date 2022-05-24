package com.navigation.reactnative;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVTabLayoutManagerDelegate;
import com.facebook.react.viewmanagers.NVTabLayoutManagerInterface;
import com.google.android.material.tabs.TabLayout;

import javax.annotation.Nonnull;

public class TabLayoutViewManager extends ViewGroupManager<TabLayoutView> implements NVTabLayoutManagerInterface<TabLayoutView> {
    private final ViewManagerDelegate<TabLayoutView> delegate;

    public TabLayoutViewManager() {
        delegate = new NVTabLayoutManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<TabLayoutView> getDelegate() {
        return delegate;
    }

    @Nonnull
    @Override
    public String getName() {
        return "NVTabLayout";
    }

    @ReactProp(name = "bottomTabs")
    public void setBottomTabs(TabLayoutView view, boolean bottomTabs) {
        view.bottomTabs = bottomTabs;
    }

    @ReactProp(name = "selectedTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setSelectedTintColor(TabLayoutView view, int selectedTintColor) {
        view.selectedTintColor = selectedTintColor != Integer.MAX_VALUE ? selectedTintColor : view.defaultTextColor;
        view.setTabTextColors(view.unselectedTintColor, view.selectedTintColor);
        view.setSelectedTabIndicatorColor(view.selectedTintColor);
        view.setTabIconTint(view.getTabTextColors());
    }

    @ReactProp(name = "unselectedTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setUnselectedTintColor(TabLayoutView view, int unselectedTintColor) {
        view.unselectedTintColor = unselectedTintColor != Integer.MAX_VALUE ? unselectedTintColor : view.defaultTextColor;
        view.setTabTextColors(view.unselectedTintColor, view.selectedTintColor);
        view.setTabIconTint(view.getTabTextColors());
    }

    @ReactProp(name = "selectedIndicatorAtTop")
    public void setSelectedIndicatorAtTop(TabLayoutView view, boolean selectedIndicatorAtTop) {
        view.setSelectedTabIndicatorGravity(!selectedIndicatorAtTop ? TabLayout.INDICATOR_GRAVITY_BOTTOM : TabLayout.INDICATOR_GRAVITY_TOP);
    }

    @ReactProp(name = "scrollable")
    public void setScrollable(TabLayoutView view, boolean scrollable) {
        view.setScrollable(scrollable);
    }

    @Nonnull
    @Override
    protected TabLayoutView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new TabLayoutView(reactContext);
    }
}
