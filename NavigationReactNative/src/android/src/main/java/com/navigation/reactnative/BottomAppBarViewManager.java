package com.navigation.reactnative;

import android.content.res.ColorStateList;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVBottomAppBarManagerDelegate;
import com.facebook.react.viewmanagers.NVBottomAppBarManagerInterface;
import com.google.android.material.bottomappbar.BottomAppBar;

import java.util.Map;

public class BottomAppBarViewManager extends ViewGroupManager<BottomAppBarView> implements NVBottomAppBarManagerInterface<BottomAppBarView> {
    private final ViewManagerDelegate<BottomAppBarView> delegate;

    public BottomAppBarViewManager() {
        delegate = new NVBottomAppBarManagerDelegate<>(this);
    }

    @NonNull
    @Override
    public String getName() {
        return "NVBottomAppBar";
    }

    @NonNull
    @Override
    protected BottomAppBarView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new BottomAppBarView(reactContext);
    }

    @ReactProp(name = "crumb")
    public void setCrumb(BottomAppBarView view, int crumb) {
        view.crumb = crumb;
    }

    @ReactProp(name = "autoNavigation")
    public void setAutoNavigation(BottomAppBarView view, boolean autoNavigation) {
        view.autoNavigation = autoNavigation;
    }

    @ReactProp(name = "navigationImage")
    public void setNavigationImage(BottomAppBarView view, @Nullable ReadableMap navigationImage) {
        view.setNavIconSource(navigationImage);
    }

    @ReactProp(name = "navigationAccessibilityLabel")
    public void setNavigationAccessibilityLabel(BottomAppBarView view, @Nullable String navigationContentDescription) {
        view.setNavigationContentDescription(navigationContentDescription);
    }

    @ReactProp(name = "overflowImage")
    public void setOverflowImage(BottomAppBarView view, @Nullable ReadableMap overflowImage) {
        view.setOverflowIconSource(overflowImage);
    }

    @ReactProp(name = "barTintColor", customType = "Color")
    public void setBarTintColor(BottomAppBarView view, @Nullable Integer barTintColor) {
        view.setBackgroundTint(ColorStateList.valueOf(barTintColor != null ? barTintColor : view.defaultBackgroundColor));
    }

    @ReactProp(name = "tintColor", customType = "Color")
    public void setTintColor(BottomAppBarView view, @Nullable Integer tintColor) {
        view.setTintColor(tintColor);
    }

    @ReactProp(name = "fabAlignmentMode")
    public void setFabAlignmentMode(BottomAppBarView view, String fabAlignmentMode) {
        if ("center".equals(fabAlignmentMode)) view.fabAlignmentMode = BottomAppBar.FAB_ALIGNMENT_MODE_CENTER;
        else if ("end".equals(fabAlignmentMode)) view.fabAlignmentMode = BottomAppBar.FAB_ALIGNMENT_MODE_END;
        else view.fabAlignmentMode = view.defaultFabAlignmentMode;
    }

    @ReactProp(name = "fabAnimationMode")
    public void setFabAnimationMode(BottomAppBarView view, String fabAnimationMode) {
        if ("slide".equals(fabAnimationMode)) view.setFabAnimationMode(BottomAppBar.FAB_ANIMATION_MODE_SLIDE);
        else if ("scale".equals(fabAnimationMode)) view.setFabAnimationMode(BottomAppBar.FAB_ANIMATION_MODE_SCALE);
        else view.setFabAnimationMode(view.defaultFabAnimationMode);
    }

    @ReactProp(name = "fabCradleMargin")
    public void setFabCradleMargin(BottomAppBarView view, float fabCradleMargin) {
        view.setFabCradleMargin(fabCradleMargin != Float.MAX_VALUE ? PixelUtil.toPixelFromDIP(fabCradleMargin) : view.defaultFabCradleMargin);
    }

    @ReactProp(name = "fabCradleRoundedCornerRadius")
    public void setFabCradleRoundedCornerRadius(BottomAppBarView view, float fabCradleRoundedCornerRadius) {
        view.setFabCradleRoundedCornerRadius(fabCradleRoundedCornerRadius != Float.MAX_VALUE ? PixelUtil.toPixelFromDIP(fabCradleRoundedCornerRadius) : view.defaultFabCradleRoundedCornerRadius);
    }

    @ReactProp(name = "fabCradleVerticalOffset")
    public void setFabCradleVerticalOffset(BottomAppBarView view, float fabCradleVerticalOffset) {
        view.setCradleVerticalOffset(fabCradleVerticalOffset != Float.MAX_VALUE ? PixelUtil.toPixelFromDIP(fabCradleVerticalOffset) : view.defaultFabCradleVerticalOffset);
    }

    @ReactProp(name = "hideOnScroll")
    public void setHideOnScroll(BottomAppBarView view, boolean hideOnScroll) {
        view.setHideOnScroll(hideOnScroll);
    }

    @ReactProp(name = "barHeight")
    public void setBarHeight(BottomAppBarView view, double barHeight) {
        view.getLayoutParams().height = (int) PixelUtil.toPixelFromDIP(barHeight);
    }

    @ReactProp(name = "navigationTestID")
    public void setNavigationTestID(BottomAppBarView view, String navigationTestID) {
        view.setNavigationTestID(navigationTestID);
    }

    @ReactProp(name = "overflowTestID")
    public void setOverflowTestID(BottomAppBarView view, String overflowTestID) {
        view.setOverflowTestID(overflowTestID);
    }

    @Override
    public void addView(BottomAppBarView parent, View child, int index) {
        parent.children.add(index, child);
        parent.setMenuItems();
    }

    @Override
    public void removeViewAt(BottomAppBarView parent, int index) {
        parent.children.remove(index);
        parent.setMenuItems();
    }

    @Override
    public int getChildCount(BottomAppBarView parent) {
        return parent.children.size();
    }

    @Override
    public View getChildAt(BottomAppBarView parent, int index) {
        return parent.children.get(index);
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull BottomAppBarView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topNavigationPress", MapBuilder.of("registrationName", "onNavigationPress"))
            .build();
    }
}
