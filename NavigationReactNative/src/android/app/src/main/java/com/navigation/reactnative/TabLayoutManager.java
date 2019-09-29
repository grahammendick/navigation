package com.navigation.reactnative;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nonnull;

public class TabLayoutManager extends ViewGroupManager<TabLayoutView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVTabLayout";
    }

    @ReactProp(name = "selectedTintColor", customType = "Color")
    public void setSelectedTintColor(TabLayoutView view, int selectedTintColor) {
        view.selectedTintColor = selectedTintColor;
        view.setTabTextColors(view.unselectedTintColor, view.selectedTintColor);
    }

    @ReactProp(name = "unselectedTintColor", customType = "Color")
    public void setUnselectedTintColor(TabLayoutView view, int unselectedTintColor) {
        view.unselectedTintColor = unselectedTintColor;
        view.setTabTextColors(view.unselectedTintColor, view.selectedTintColor);
    }

    @Nonnull
    @Override
    protected TabLayoutView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new TabLayoutView(reactContext);
    }
}
