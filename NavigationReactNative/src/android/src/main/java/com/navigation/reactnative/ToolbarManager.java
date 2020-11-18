package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;

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
    public void setTitle(ToolbarView view, String title) {
        view.setPlainTitle(title);
    }

    @ReactProp(name = "titleFontFamily")
    public void setTitleFontFamily(ToolbarView view, String titleFontFamily) {
        view.setTitleFontFamily(titleFontFamily);
    }

    @ReactProp(name = "titleFontWeight")
    public void setTitleFontWeight(ToolbarView view, String titleFontWeight) {
        view.setTitleFontWeight(titleFontWeight);
    }

    @ReactProp(name = "titleFontStyle")
    public void setTitleFontStyle(ToolbarView view, String titleFontStyle) {
        view.setTitleFontStyle(titleFontStyle);
    }

    @ReactProp(name = "titleFontSize")
    public void setTitleFontSize(ToolbarView view, Integer titleFontSize) {
        view.setTitleFontSize(titleFontSize);
    }

    @ReactProp(name = "logo")
    public void setLogo(ToolbarView view, ReadableMap logo) {
        view.setLogoSource(logo);
    }

    @ReactProp(name = "navigationImage")
    public void setNavIcon(ToolbarView view, ReadableMap navIcon) {
        view.setNavIconSource(navIcon);
    }

    @ReactProp(name = "overflowImage")
    public void setOverflowIcon(ToolbarView view, ReadableMap overflowIcon) {
        view.setOverflowIconSource(overflowIcon);
    }

    @ReactProp(name = "barTintColor", customType = "Color")
    public void setBarTintColor(ToolbarView view, Integer barTintColor) {
        if (barTintColor != null)
            view.setBackgroundColor(barTintColor);
        else
            view.setBackground(null);
    }

    @ReactProp(name = "tintColor", customType = "Color")
    public void setTintColor(ToolbarView view, Integer tintColor) {
        view.setTintColor(tintColor);
    }

    @ReactProp(name = "titleColor", customType = "Color")
    public void setTitleColor(ToolbarView view, Integer textColor) {
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

    @ReactProp(name = "backTestID")
    public void setBackTestID(ToolbarView view, String backTestID) {
        view.setBackTestID(backTestID);
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
    protected void onAfterUpdateTransaction(@NonNull ToolbarView view) {
        super.onAfterUpdateTransaction(view);
        view.styleTitle();
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("onNavigationPress", MapBuilder.of("registrationName", "onNavigationPress"))
            .build();
    }
}
