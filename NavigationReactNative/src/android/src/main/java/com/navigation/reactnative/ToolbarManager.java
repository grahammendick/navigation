package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.appbar.CollapsingToolbarLayout;

import java.util.Map;

import javax.annotation.Nonnull;

public class ToolbarManager extends ViewGroupManager<ToolbarView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVToolbar";
    }

    @Nonnull
    @Override
    protected ToolbarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new ToolbarView(reactContext);
    }

    @ReactProp(name = "title")
    public void setTitle(ToolbarView view, @Nullable String title) {
        view.setTitle(title);
    }

    @ReactProp(name = "logo")
    public void setLogo(ToolbarView view, @Nullable ReadableMap logo) {
        view.setLogoSource(logo);
    }

    @ReactProp(name = "navigationImage")
    public void setNavIcon(ToolbarView view, @Nullable ReadableMap navIcon) {
        view.setNavIconSource(navIcon);
    }

    @ReactProp(name = "overflowImage")
    public void setOverflowIcon(ToolbarView view, @Nullable ReadableMap overflowIcon) {
        view.setOverflowIconSource(overflowIcon);
    }

    @ReactProp(name = "barTintColor", customType = "Color")
    public void setBarTintColor(ToolbarView view, @Nullable Integer barTintColor) {
        if (barTintColor != null)
            view.setBackgroundColor(barTintColor);
        else
            view.setBackground(null);
    }

    @ReactProp(name = "tintColor", customType = "Color")
    public void setTintColor(ToolbarView view, @Nullable Integer tintColor) {
        view.setTintColor(tintColor);
    }

    @ReactProp(name = "titleColor", customType = "Color")
    public void setTitleColor(ToolbarView view, @Nullable Integer textColor) {
        view.setTitleTextColor(textColor != null ? textColor : view.defaultTitleTextColor);
    }

    @ReactProp(name = "height")
    public void setHeight(ToolbarView view, double height) {
        view.getLayoutParams().height = (int) PixelUtil.toPixelFromDIP(height);
    }

    @ReactProp(name = "pin")
    public void setPin(ToolbarView view, boolean pin) {
        if (pin) {
            CollapsingToolbarLayout.LayoutParams params = new CollapsingToolbarLayout.LayoutParams(view.getLayoutParams().width, view.getLayoutParams().height);
            params.setCollapseMode(CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_PIN);
            view.setLayoutParams(params);
        } else {
            AppBarLayout.LayoutParams params = new AppBarLayout.LayoutParams(view.getLayoutParams().width, view.getLayoutParams().height);
            params.setScrollFlags(AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL | AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS);
            view.setLayoutParams(params);
        }
    }

    @Override
    public void addView(ToolbarView parent, View child, int index) {
        parent.children.add(index, child);
        if (child instanceof TitleBarView)
            parent.addView(child);
        if (child instanceof BarButtonView)
            parent.setMenuItems();
    }

    @Override
    public void removeViewAt(ToolbarView parent, int index) {
        View child = parent.children.remove(index);
        if (child instanceof TitleBarView)
            parent.removeView(child);
        if (child instanceof BarButtonView)
            parent.setMenuItems();
    }

    @Override
    public int getChildCount(ToolbarView parent) {
        return parent.children.size();
    }

    @Override
    public View getChildAt(ToolbarView parent, int index) {
        return parent.children.get(index);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("onNavigationPress", MapBuilder.of("registrationName", "onNavigationPress"))
            .build();
    }
}
