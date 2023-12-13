package com.navigation.reactnative;

import android.content.res.ColorStateList;
import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.material.bottomappbar.BottomAppBar;

import java.util.Map;

public class BottomAppBarManager extends ViewGroupManager<BottomAppBarView> {
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

    @ReactProp(name = "navigationImage")
    public void setNavIcon(BottomAppBarView view, ReadableMap navIcon) {
        view.setNavIconSource(navIcon);
    }

    @ReactProp(name = "overflowImage")
    public void setOverflowIcon(BottomAppBarView view, ReadableMap overflowIcon) {
        view.setOverflowIconSource(overflowIcon);
    }

    @ReactProp(name = "barTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBarTintColor(BottomAppBarView view, int barTintColor) {
        view.setBackgroundTint(ColorStateList.valueOf(barTintColor != Integer.MAX_VALUE ? barTintColor : view.defaultBackgroundColor));
    }

    @ReactProp(name = "tintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setTintColor(BottomAppBarView view, int tintColor) {
        view.setTintColor(tintColor != Integer.MAX_VALUE ? tintColor : null);
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

    @ReactProp(name = "fabCradleMargin", defaultFloat = Float.MAX_VALUE)
    public void setFabCradleMargin(BottomAppBarView view, float fabCradleMargin) {
        view.setFabCradleMargin(fabCradleMargin != Float.MAX_VALUE ? PixelUtil.toPixelFromDIP(fabCradleMargin) : view.defaultFabCradleMargin);
    }

    @ReactProp(name = "fabCradleRoundedCornerRadius", defaultFloat = Float.MAX_VALUE)
    public void setFabCradleRoundedCornerRadius(BottomAppBarView view, float fabCradleRoundedCornerRadius) {
        view.setFabCradleRoundedCornerRadius(fabCradleRoundedCornerRadius != Float.MAX_VALUE ? PixelUtil.toPixelFromDIP(fabCradleRoundedCornerRadius) : view.defaultFabCradleRoundedCornerRadius);
    }

    @ReactProp(name = "fabCradleVerticalOffset", defaultFloat = Float.MAX_VALUE)
    public void setFabCradleVerticalOffset(BottomAppBarView view, float fabCradleVerticalOffset) {
        view.setCradleVerticalOffset(fabCradleVerticalOffset != Float.MAX_VALUE ? PixelUtil.toPixelFromDIP(fabCradleVerticalOffset) : view.defaultFabCradleVerticalOffset);
    }

    @ReactProp(name = "hideOnScroll")
    public void setHideOnScroll(BottomAppBarView view, boolean hideOnScroll) {
        view.setHideOnScroll(hideOnScroll);
    }

    @ReactProp(name = "height")
    public void setHeight(BottomAppBarView view, double height) {
        view.getLayoutParams().height = (int) PixelUtil.toPixelFromDIP(height);
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
        view.setFabAlignmentMode(view.fabAlignmentMode);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topNavigationPress", MapBuilder.of("registrationName", "onNavigationPress"))
            .build();
    }
}
