package com.navigation.reactnative;

import android.graphics.drawable.ColorDrawable;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVCollapsingBarManagerDelegate;
import com.facebook.react.viewmanagers.NVCollapsingBarManagerInterface;

import javax.annotation.Nonnull;

public class CollapsingBarViewManager extends ViewGroupManager<CollapsingBarView> implements NVCollapsingBarManagerInterface<CollapsingBarView> {
    private final ViewManagerDelegate<CollapsingBarView> delegate;

    public CollapsingBarViewManager() {
        delegate = new NVCollapsingBarManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<CollapsingBarView> getDelegate() {
        return delegate;
    }

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

    @ReactProp(name = "largeTitleFontFamily")
    public void setLargeTitleFontFamily(CollapsingBarView view, String largeTitleFontFamily) {
        view.setLargeTitleFontFamily(largeTitleFontFamily);
    }

    @ReactProp(name = "largeTitleFontWeight")
    public void setLargeTitleFontWeight(CollapsingBarView view, String largeTitleFontWeight) {
        view.setLargeTitleFontWeight(largeTitleFontWeight);
    }

    @ReactProp(name = "largeTitleFontStyle")
    public void setLargeTitleFontStyle(CollapsingBarView view, String largeTitleFontStyle) {
        view.setLargeTitleFontStyle(largeTitleFontStyle);
    }

    @ReactProp(name = "titleEnabled")
    public void setTitleEnabled(CollapsingBarView view, boolean titleEnabled) {
        view.setTitleEnabled(titleEnabled);
    }

    @Override
    @ReactProp(name = "contentScrimColor", customType = "Color")
    public void setContentScrimColor(CollapsingBarView view, @Nullable Integer contentScrimColor) {
        view.setContentScrim(contentScrimColor != null ? new ColorDrawable(contentScrimColor) : view.defaultContentScrim);
    }

    @Override
    @ReactProp(name = "collapsedTitleColor", customType = "Color")
    public void setCollapsedTitleColor(CollapsingBarView view, @Nullable Integer collapsedTitleColor) {
        view.setCollapsedTitleTextColor(collapsedTitleColor != null ? collapsedTitleColor : view.defaultTitleTextColor);
    }

    @Override
    @ReactProp(name = "expandedTitleColor", customType = "Color")
    public void setExpandedTitleColor(CollapsingBarView view, @Nullable Integer expandedTitleColor) {
        view.setExpandedTitleColor(expandedTitleColor != null ? expandedTitleColor : view.defaultTitleTextColor);
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
