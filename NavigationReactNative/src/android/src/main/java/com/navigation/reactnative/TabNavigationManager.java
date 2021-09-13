package com.navigation.reactnative;

import android.content.res.ColorStateList;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nonnull;

public class TabNavigationManager extends ViewGroupManager<TabNavigationView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVTabNavigation";
    }

    @ReactProp(name = "bottomTabs")
    public void setBottomTabs(TabNavigationView view, boolean bottomTabs) {
        view.bottomTabs = bottomTabs;
    }

    @ReactProp(name = "selectedTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setSelectedTintColor(TabNavigationView view, int selectedTintColor) {
        view.selectedTintColor = selectedTintColor != Integer.MAX_VALUE ? selectedTintColor : view.defaultTextColor;
        view.setItemTextColor(new ColorStateList(
            new int[][]{ new int[]{-android.R.attr.state_checked}, new int[]{android.R.attr.state_checked }},
            new int[]{ view.unselectedTintColor, view.selectedTintColor }
        ));
        view.setItemIconTintList(view.getItemTextColor());
    }

    @ReactProp(name = "unselectedTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setUnselectedTintColor(TabNavigationView view, int unselectedTintColor) {
        view.unselectedTintColor = unselectedTintColor != Integer.MAX_VALUE ? unselectedTintColor : view.defaultTextColor;
        view.setItemTextColor(new ColorStateList(
            new int[][]{ new int[]{-android.R.attr.state_checked}, new int[]{android.R.attr.state_checked }},
            new int[]{ view.unselectedTintColor, view.selectedTintColor }
        ));
        view.setItemIconTintList(view.getItemTextColor());
    }

    @Nonnull
    @Override
    protected TabNavigationView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new TabNavigationView(reactContext);
    }
}
