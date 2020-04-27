package com.navigation.reactnative;

import android.graphics.drawable.ColorDrawable;

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

    @ReactProp(name = "titleEnabled")
    public void setTitleEnabled(CollapsingBarView view, boolean titleEnabled) {
        view.setTitleEnabled(titleEnabled);
    }

    @ReactProp(name = "contentScrimColor", customType = "Color")
    public void setContentScrimColor(CollapsingBarView view, @Nullable Integer contentScrimColor) {
        view.setContentScrim(contentScrimColor != null ? new ColorDrawable(contentScrimColor) : view.defaultContentScrim);
    }

    @ReactProp(name = "collapsedTitleColor", customType = "Color")
    public void setCollapsedTitleColor(CollapsingBarView view, @Nullable Integer collapsedTitleColor) {
        view.setCollapsedTitleTextColor(collapsedTitleColor != null ? collapsedTitleColor : view.defaultTitleTextColor);
    }

    @ReactProp(name = "expandedTitleColor", customType = "Color")
    public void setExpandedTitleColor(CollapsingBarView view, @Nullable Integer expandedTitleColor) {
        view.setExpandedTitleColor(expandedTitleColor != null ? expandedTitleColor : view.defaultTitleTextColor);
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
}
