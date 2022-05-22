package com.navigation.reactnative;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.MenuItem;

import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVNavigationBarManagerDelegate;
import com.facebook.react.viewmanagers.NVNavigationBarManagerInterface;
import com.google.android.material.appbar.AppBarLayout;

import java.util.Map;

import javax.annotation.Nonnull;

@ReactModule(name = "NVNavigationBar")
public class NavigationBarViewManager extends ViewGroupManager<NavigationBarView> implements NVNavigationBarManagerInterface<NavigationBarView> {
    private final ViewManagerDelegate<NavigationBarView> delegate;

    public NavigationBarViewManager() {
        delegate = new NVNavigationBarManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<NavigationBarView> getDelegate() {
        return delegate;
    }

    @Nonnull
    @Override
    public String getName() {
        return "NVNavigationBar";
    }

    @Nonnull
    @Override
    protected NavigationBarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new NavigationBarView(reactContext);
    }

    @ReactProp(name = "barTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBarTintColor(NavigationBarView view, int barTintColor) {
        if (barTintColor != Integer.MAX_VALUE) {
            view.setBackground(new ColorDrawable(barTintColor));
            if (Color.alpha(barTintColor) < 255)
                view.setOutlineProvider(null);
            else
                view.setOutlineProvider(view.defaultOutlineProvider);
        } else {
            view.setBackground(view.defaultBackground);
            view.setOutlineProvider(view.defaultOutlineProvider);
        }
    }

    @ReactProp(name = "hide")
    public void setHide(NavigationBarView view, boolean hide) {
        view.setExpanded(!hide, true);
    }

    @ReactProp(name = "height")
    public void setHeight(NavigationBarView view, double height) {
        view.getLayoutParams().height = height != 0 ? (int) PixelUtil.toPixelFromDIP(height) : AppBarLayout.LayoutParams.WRAP_CONTENT;
        if (view.getParent() instanceof CoordinatorLayoutView) {
            CoordinatorLayoutView coordinatorLayoutView = (CoordinatorLayoutView) view.getParent();
            coordinatorLayoutView.requestLayout();
        }
    }

    @Override
    public void setHidden(NavigationBarView view, boolean value) {
    }

    @Override
    public void setLargeTitle(NavigationBarView view, boolean value) {
    }

    @Override
    public void setTitle(NavigationBarView view, @Nullable String value) {
    }

    @Override
    public void setTitleFontFamily(NavigationBarView view, @Nullable String value) {
    }

    @Override
    public void setTitleFontWeight(NavigationBarView view, @Nullable String value) {
    }

    @Override
    public void setTitleFontStyle(NavigationBarView view, @Nullable String value) {
    }

    @Override
    public void setTitleFontSize(NavigationBarView view, float value) {
    }

    @Override
    public void setLargeTitleFontFamily(NavigationBarView view, @Nullable String value) {
    }

    @Override
    public void setLargeTitleFontWeight(NavigationBarView view, @Nullable String value) {
    }

    @Override
    public void setLargeTitleFontStyle(NavigationBarView view, @Nullable String value) {
    }

    @Override
    public void setLargeTitleFontSize(NavigationBarView view, float value) {
    }

    @Override
    public void setBackFontFamily(NavigationBarView view, @Nullable String value) {
    }

    @Override
    public void setBackFontWeight(NavigationBarView view, @Nullable String value) {
    }

    @Override
    public void setBackFontStyle(NavigationBarView view, @Nullable String value) {
    }

    @Override
    public void setBackFontSize(NavigationBarView view, float value) {
    }

    @Override
    public void setBarTintColor(NavigationBarView view, @Nullable Integer value) {
    }

    @Override
    public void setLargeBarTintColor(NavigationBarView view, @Nullable Integer value) {
    }

    @Override
    public void setTintColor(NavigationBarView view, @Nullable Integer value) {
    }

    @Override
    public void setTitleColor(NavigationBarView view, @Nullable Integer value) {
    }

    @Override
    public void setLargeTitleColor(NavigationBarView view, @Nullable Integer value) {
    }

    @Override
    public void setBackTitle(NavigationBarView view, @Nullable String value) {
    }

    @Override
    public void setBackTitleOn(NavigationBarView view, boolean value) {
    }

    @Override
    public void setBackTestID(NavigationBarView view, @Nullable String value) {
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("onOffsetChanged", MapBuilder.of("registrationName", "onOffsetChanged"))
            .build();
    }

    @Override
    public Map<String, Object> getExportedViewConstants() {
        return MapBuilder.<String, Object>of(
            "ShowAsAction",
            MapBuilder.of(
                "never", MenuItem.SHOW_AS_ACTION_NEVER,
                "always", MenuItem.SHOW_AS_ACTION_ALWAYS,
                "ifRoom", MenuItem.SHOW_AS_ACTION_IF_ROOM));
    }
}
