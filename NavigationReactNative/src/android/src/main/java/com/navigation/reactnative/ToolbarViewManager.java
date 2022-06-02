package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVToolbarManagerDelegate;
import com.facebook.react.viewmanagers.NVToolbarManagerInterface;
import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.appbar.CollapsingToolbarLayout;

import java.util.Map;

import javax.annotation.Nonnull;

@ReactModule(name = "NVToolbar")
public class ToolbarViewManager extends ViewGroupManager<ToolbarView> implements NVToolbarManagerInterface<ToolbarView> {
    private final ViewManagerDelegate<ToolbarView> delegate;

    public ToolbarViewManager() {
        delegate = new NVToolbarManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<ToolbarView> getDelegate() {
        return delegate;
    }

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

    @Override
    @ReactProp(name = "title")
    public void setTitle(ToolbarView view, String title) {
        view.setPlainTitle(title);
    }

    @Override
    @ReactProp(name = "titleFontFamily")
    public void setTitleFontFamily(ToolbarView view, String titleFontFamily) {
        view.setTitleFontFamily(titleFontFamily);
    }

    @Override
    @ReactProp(name = "titleFontWeight")
    public void setTitleFontWeight(ToolbarView view, String titleFontWeight) {
        view.setTitleFontWeight(titleFontWeight);
    }

    @Override
    @ReactProp(name = "titleFontStyle")
    public void setTitleFontStyle(ToolbarView view, String titleFontStyle) {
        view.setTitleFontStyle(titleFontStyle);
    }

    @Override
    @ReactProp(name = "titleFontSize")
    public void setTitleFontSize(ToolbarView view, float titleFontSize) {
        view.setTitleFontSize(Math.round(titleFontSize));
    }

    @Override
    @ReactProp(name = "barTintColor", customType = "Color")
    public void setBarTintColor(ToolbarView view, @Nullable Integer barTintColor) {
        if (barTintColor != null)
            view.setBackgroundColor(barTintColor);
        else
            view.setBackground(null);
    }

    @Override
    @ReactProp(name = "tintColor", customType = "Color")
    public void setTintColor(ToolbarView view, @Nullable Integer tintColor) {
        view.setTintColor(tintColor);
    }

    @Override
    @ReactProp(name = "titleColor", customType = "Color")
    public void setTitleColor(ToolbarView view, @Nullable Integer titleColor) {
        view.setTitleTextColor(titleColor != null ? titleColor : view.defaultTitleTextColor);
    }

    @Override
    @ReactProp(name = "navigationImage")
    public void setNavigationImage(ToolbarView view, @Nullable ReadableMap navigationImage) {
        view.setNavIconSource(navigationImage);
    }

    @ReactProp(name = "logo")
    public void setLogo(ToolbarView view, ReadableMap logo) {
        view.setLogoSource(logo);
    }

    @Override
    @ReactProp(name = "overflowImage")
    public void setOverflowImage(ToolbarView view, @Nullable ReadableMap overflowImage) {
        view.setOverflowIconSource(overflowImage);
    }

    @Override
    @ReactProp(name = "navigationAccessibilityLabel")
    public void setNavigationAccessibilityLabel(ToolbarView view, @Nullable String navigationAccessibilityLabel) {
        view.setNavigationContentDescription(navigationAccessibilityLabel);
    }

    @ReactProp(name = "barHeight")
    public void setBarHeight(ToolbarView view, double height) {
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

    @ReactProp(name = "navigationTestID")
    public void setNavigationTestID(ToolbarView view, String navigationTestID) {
        view.setNavigationTestID(navigationTestID);
    }

    @ReactProp(name = "overflowTestID")
    public void setOverflowTestID(ToolbarView view, String overflowTestID) {
        view.setOverflowTestID(overflowTestID);
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
    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull ToolbarView view) {
        super.onAfterUpdateTransaction(view);
        view.styleTitle();
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topOnNavigationPress", MapBuilder.of("registrationName", "onNavigationPress"))
            .build();
    }
}
