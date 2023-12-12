package com.navigation.reactnative;

import static com.google.android.material.navigation.NavigationBarView.LABEL_VISIBILITY_AUTO;
import static com.google.android.material.navigation.NavigationBarView.LABEL_VISIBILITY_LABELED;
import static com.google.android.material.navigation.NavigationBarView.LABEL_VISIBILITY_SELECTED;
import static com.google.android.material.navigation.NavigationBarView.LABEL_VISIBILITY_UNLABELED;

import android.content.res.ColorStateList;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVTabNavigationManagerDelegate;
import com.facebook.react.viewmanagers.NVTabNavigationManagerInterface;

import java.util.Map;

import javax.annotation.Nonnull;

public class TabNavigationViewManager extends ViewGroupManager<TabNavigationView> implements NVTabNavigationManagerInterface<TabNavigationView> {
    private final ViewManagerDelegate<TabNavigationView> delegate;

    public TabNavigationViewManager() {
        delegate = new NVTabNavigationManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<TabNavigationView> getDelegate() {
        return delegate;
    }

    @Nonnull
    @Override
    public String getName() {
        return "NVTabNavigation";
    }

    @ReactProp(name = "labelVisibilityMode", defaultInt = LABEL_VISIBILITY_AUTO)
    public void setLabelVisibilityMode(TabNavigationView view, int labelVisibilityMode) {
        view.setLabelVisibilityMode(labelVisibilityMode);
    }

    @Override
    @ReactProp(name = "itemHorizontalTranslation")
    public void setItemHorizontalTranslation(TabNavigationView view, boolean itemHorizontalTranslation) {
        view.setItemHorizontalTranslationEnabled(itemHorizontalTranslation);
    }

    @Override
    @ReactProp(name = "selectedTintColor", customType = "Color")
    public void setSelectedTintColor(TabNavigationView view, @Nullable Integer selectedTintColor) {
        view.selectedTintColor = selectedTintColor != null ? selectedTintColor : view.defaultTextColor;
        view.setItemTextColor(new ColorStateList(
            new int[][]{ new int[]{-android.R.attr.state_checked}, new int[]{android.R.attr.state_checked }},
            new int[]{ view.unselectedTintColor, view.selectedTintColor }
        ));
        view.setItemIconTintList(view.getItemTextColor());
    }

    @Override
    @ReactProp(name = "unselectedTintColor", customType = "Color")
    public void setUnselectedTintColor(TabNavigationView view, @Nullable Integer unselectedTintColor) {
        view.unselectedTintColor = unselectedTintColor != null ? unselectedTintColor : view.defaultTextColor;
        view.setItemTextColor(new ColorStateList(
            new int[][]{ new int[]{-android.R.attr.state_checked}, new int[]{android.R.attr.state_checked }},
            new int[]{ view.unselectedTintColor, view.selectedTintColor }
        ));
        view.setItemIconTintList(view.getItemTextColor());
    }

    @ReactProp(name = "activeIndicatorColor", customType = "Color")
    public void setActiveIndicatorColor(TabNavigationView view, @Nullable Integer activeIndicatorColor) {
        view.setItemActiveIndicatorColor(ColorStateList.valueOf(activeIndicatorColor != null ? activeIndicatorColor : view.defaultActiveIndicatorColor));
    }

    @ReactProp(name = "rippleColor", customType = "Color")
    public void setRippleColor(TabNavigationView view, @Nullable Integer rippleColor) {
        view.setItemRippleColor(ColorStateList.valueOf(rippleColor != null ? rippleColor : view.defaultRippleColor));
    }

    @ReactProp(name = "shadowColor", customType = "Color")
    public void setShadowColor(@NonNull TabNavigationView view, @Nullable Integer shadowColor) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            view.setOutlineAmbientShadowColor(shadowColor != null ? shadowColor : view.defaultShadowColor);
            view.setOutlineSpotShadowColor(shadowColor != null ? shadowColor : view.defaultShadowColor);
        }
    }

    @Override
    public Map<String, Object> getExportedViewConstants() {
        return MapBuilder.<String, Object>of(
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
