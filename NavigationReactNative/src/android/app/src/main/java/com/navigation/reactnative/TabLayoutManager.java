package com.navigation.reactnative;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.material.tabs.TabLayout;

import javax.annotation.Nonnull;

public class TabLayoutManager extends ViewGroupManager<TabLayoutView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVTabLayout";
    }

    @ReactProp(name = "selectedTintColor", customType = "Color")
    public void setSelectedTintColor(TabLayoutView view, @Nullable Integer selectedTintColor) {
        view.selectedTintColor = selectedTintColor != null ? selectedTintColor : view.defaultTextColor;
        view.setTabTextColors(view.unselectedTintColor, view.selectedTintColor);
        view.setSelectedTabIndicatorColor(view.selectedTintColor);
    }

    @ReactProp(name = "unselectedTintColor", customType = "Color")
    public void setUnselectedTintColor(TabLayoutView view, @Nullable Integer  unselectedTintColor) {
        view.unselectedTintColor = unselectedTintColor != null ? unselectedTintColor : view.defaultTextColor;
        view.setTabTextColors(view.unselectedTintColor, view.selectedTintColor);
    }

    @ReactProp(name = "selectedIndicatorAtTop")
    public void setSelectedIndicatorAtTop(TabLayoutView view, boolean selectedIndicatorAtTop) {
        view.setSelectedTabIndicatorGravity(!selectedIndicatorAtTop ? TabLayout.INDICATOR_GRAVITY_BOTTOM : TabLayout.INDICATOR_GRAVITY_TOP);
    }

    @Nonnull
    @Override
    protected TabLayoutView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new TabLayoutView(reactContext);
    }
}
