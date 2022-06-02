package com.navigation.reactnative;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVTabLayoutRTLManagerDelegate;
import com.facebook.react.viewmanagers.NVTabLayoutRTLManagerInterface;
import com.google.android.material.tabs.TabLayout;

import javax.annotation.Nonnull;

public class TabLayoutRTLViewManager extends ViewGroupManager<TabLayoutRTLView> implements NVTabLayoutRTLManagerInterface<TabLayoutRTLView> {
    private final ViewManagerDelegate<TabLayoutRTLView> delegate;

    public TabLayoutRTLViewManager() {
        delegate = new NVTabLayoutRTLManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<TabLayoutRTLView> getDelegate() {
        return delegate;
    }

    @Nonnull
    @Override
    public String getName() {
        return "NVTabLayoutRTL";
    }

    @ReactProp(name = "selectedTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setSelectedTintColor(TabLayoutRTLView view, int selectedTintColor) {
        view.selectedTintColor = selectedTintColor != Integer.MAX_VALUE ? selectedTintColor : view.defaultTextColor;
        view.setTabTextColors(view.unselectedTintColor, view.selectedTintColor);
        view.setSelectedTabIndicatorColor(view.selectedTintColor);
        view.setTabIconTint(view.getTabTextColors());
    }

    @ReactProp(name = "unselectedTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setUnselectedTintColor(TabLayoutRTLView view, int unselectedTintColor) {
        view.unselectedTintColor = unselectedTintColor != Integer.MAX_VALUE ? unselectedTintColor : view.defaultTextColor;
        view.setTabTextColors(view.unselectedTintColor, view.selectedTintColor);
        view.setTabIconTint(view.getTabTextColors());
    }

    @ReactProp(name = "selectedIndicatorAtTop")
    public void setSelectedIndicatorAtTop(TabLayoutRTLView view, boolean selectedIndicatorAtTop) {
        view.setSelectedTabIndicatorGravity(!selectedIndicatorAtTop ? TabLayout.INDICATOR_GRAVITY_BOTTOM : TabLayout.INDICATOR_GRAVITY_TOP);
    }

    @ReactProp(name = "scrollable")
    public void setScrollable(TabLayoutRTLView view, boolean scrollable) {
        view.setScrollable(scrollable);
    }

    @Nonnull
    @Override
    protected TabLayoutRTLView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new TabLayoutRTLView(reactContext);
    }
}
