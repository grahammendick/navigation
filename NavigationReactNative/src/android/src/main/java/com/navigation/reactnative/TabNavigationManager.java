package com.navigation.reactnative;

import static com.google.android.material.navigation.NavigationBarView.LABEL_VISIBILITY_AUTO;
import static com.google.android.material.navigation.NavigationBarView.LABEL_VISIBILITY_LABELED;
import static com.google.android.material.navigation.NavigationBarView.LABEL_VISIBILITY_SELECTED;
import static com.google.android.material.navigation.NavigationBarView.LABEL_VISIBILITY_UNLABELED;

import android.content.res.ColorStateList;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

public class TabNavigationManager extends ViewGroupManager<TabNavigationView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVTabNavigation";
    }

    @ReactProp(name = "labelVisibilityMode", defaultInt = LABEL_VISIBILITY_AUTO)
    public void setLabelVisibilityMode (TabNavigationView view, int labelVisibilityMode) {
        view.setLabelVisibilityMode(labelVisibilityMode);
    }

    @ReactProp(name = "itemHorizontalTranslation")
    public void setItemHorizontalTranslation (TabNavigationView view, boolean itemHorizontalTranslation) {
        view.setItemHorizontalTranslationEnabled(itemHorizontalTranslation);
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

    @ReactProp(name = "activeIndicatorColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setActiveIndicatorColor(TabNavigationView view, int activeIndicatorColor) {
        view.setItemActiveIndicatorColor(ColorStateList.valueOf(activeIndicatorColor != Integer.MAX_VALUE ? activeIndicatorColor : view.defaultActiveIndicatorColor));
    }

    @ReactProp(name = "rippleColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setRippleColor(TabNavigationView view, int rippleColor) {
        view.setItemRippleColor(ColorStateList.valueOf(rippleColor != Integer.MAX_VALUE ? rippleColor : view.defaultRippleColor));
    }

    @Override
    public Map<String, Object> getExportedViewConstants() {
        return MapBuilder.of(
            "LabelVisibility",
            MapBuilder.of(
                "auto", LABEL_VISIBILITY_AUTO,
                "labeled", LABEL_VISIBILITY_LABELED,
                "unlabeled", LABEL_VISIBILITY_UNLABELED,
                "selected", LABEL_VISIBILITY_SELECTED));
    }

    @Nonnull
    @Override
    protected TabNavigationView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new TabNavigationView(reactContext);
    }
}
