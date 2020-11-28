package com.navigation.reactnative;

import android.graphics.drawable.ColorDrawable;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nonnull;

public class CollapsingBarManager extends ViewGroupManager<CollapsingBarView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVCollapsingBar";
    }

    @Nonnull
    @Override
    protected CollapsingBarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new CollapsingBarView(reactContext);
    }

    @ReactProp(name = "title")
    public void setTitle(CollapsingBarView view, @Nullable String title) {
        view.setTitle(title);
    }

    @ReactProp(name = "titleFontFamily")
    public void setTitleFontFamily(CollapsingBarView view, String titleFontFamily) {
        view.setTitleFontFamily(titleFontFamily);
    }

    @ReactProp(name = "titleFontWeight")
    public void setTitleFontWeight(CollapsingBarView view, String titleFontWeight) {
        view.setTitleFontWeight(titleFontWeight);
    }

    @ReactProp(name = "titleFontStyle")
    public void setTitleFontStyle(CollapsingBarView view, String titleFontStyle) {
        view.setTitleFontStyle(titleFontStyle);
    }

    @ReactProp(name = "titleEnabled")
    public void setTitleEnabled(CollapsingBarView view, boolean titleEnabled) {
        view.setTitleEnabled(titleEnabled);
    }

    @ReactProp(name = "contentScrimColor", customType = "Color")
    public void setContentScrimColor(CollapsingBarView view, @Nullable Integer contentScrimColor) {
        view.setContentScrim(contentScrimColor != null ? new ColorDrawable(contentScrimColor) : view.defaultContentScrim);
    }

    @ReactProp(name = "collapsedTitleColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setCollapsedTitleColor(CollapsingBarView view, int collapsedTitleColor) {
        view.setCollapsedTitleTextColor(collapsedTitleColor != Integer.MAX_VALUE ? collapsedTitleColor : view.defaultTitleTextColor);
    }

    @ReactProp(name = "expandedTitleColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setExpandedTitleColor(CollapsingBarView view, int expandedTitleColor) {
        view.setExpandedTitleColor(expandedTitleColor != Integer.MAX_VALUE ? expandedTitleColor : view.defaultTitleTextColor);
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull CollapsingBarView view) {
        super.onAfterUpdateTransaction(view);
        view.styleTitle();
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
}
