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

    @ReactProp(name = "bottomTabs")
    public void setBottomTabs(TabLayoutView view, boolean bottomTabs) {
        view.bottomTabs = bottomTabs;
    }

    @ReactProp(name = "selectedTintColor", customType = "Color")
    public void setSelectedTintColor(TabLayoutView view, @Nullable Integer selectedTintColor) {
        view.selectedTintColor = selectedTintColor != null ? selectedTintColor : view.defaultTextColor;
        view.setTabTextColors(view.unselectedTintColor, view.selectedTintColor);
        view.setSelectedTabIndicatorColor(view.selectedTintColor);
        view.setTabIconTint(view.getTabTextColors());
    }

    @ReactProp(name = "unselectedTintColor", customType = "Color")
    public void setUnselectedTintColor(TabLayoutView view, @Nullable Integer  unselectedTintColor) {
        view.unselectedTintColor = unselectedTintColor != null ? unselectedTintColor : view.defaultTextColor;
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
