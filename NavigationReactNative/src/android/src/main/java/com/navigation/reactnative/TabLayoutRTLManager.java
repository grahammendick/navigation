package com.navigation.reactnative;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.material.tabs.TabLayout;

import javax.annotation.Nonnull;

public class TabLayoutRTLManager extends ViewGroupManager<TabLayoutRTLView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVTabLayout";
    }

    @ReactProp(name = "selectedTintColor", customType = "Color")
    public void setSelectedTintColor(TabLayoutRTLView view, @Nullable Integer selectedTintColor) {
        view.selectedTintColor = selectedTintColor != null ? selectedTintColor : view.defaultTextColor;
        view.setTabTextColors(view.unselectedTintColor, view.selectedTintColor);
        view.setSelectedTabIndicatorColor(view.selectedTintColor);
        view.setTabIconTint(view.getTabTextColors());
    }

    @ReactProp(name = "unselectedTintColor", customType = "Color")
    public void setUnselectedTintColor(TabLayoutRTLView view, @Nullable Integer  unselectedTintColor) {
        view.unselectedTintColor = unselectedTintColor != null ? unselectedTintColor : view.defaultTextColor;
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
