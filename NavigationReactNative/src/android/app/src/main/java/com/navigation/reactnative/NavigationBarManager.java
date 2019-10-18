package com.navigation.reactnative;

import android.view.View;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

import androidx.annotation.Nullable;

public class NavigationBarManager extends ViewGroupManager<NavigationBarView> {
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

    @ReactProp(name = "title")
    public void setTitle(NavigationBarView view, @Nullable String title) {
        view.setTitle(title);
    }

    @ReactProp(name = "logo")
    public void setLogo(NavigationBarView view, @Nullable ReadableMap logo) {
        view.setLogoSource(logo);
    }

    @ReactProp(name = "navIcon")
    public void setNavIcon(NavigationBarView view, @Nullable ReadableMap navIcon) {
        view.setNavIconSource(navIcon);
    }

    @ReactProp(name = "overflowIcon")
    public void setOverflowIcon(NavigationBarView view, @Nullable ReadableMap overflowIcon) {
        view.setOverflowIconSource(overflowIcon);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onIconClicked", MapBuilder.of("registrationName", "onIconClicked"))
                .build();
    }

    @Override
    public int getChildCount(NavigationBarView parent) {
        return parent.barViews.size();
    }

    @Override
    public View getChildAt(NavigationBarView parent, int index) {
        return parent.barViews.get(index);
    }

    @Override
    public void addView(NavigationBarView parent, View child, int index) {
        parent.addBar(index, child);
    }

    @Override
    public void removeViewAt(NavigationBarView parent, int index) {
        parent.removeBar(index);
    }
}
