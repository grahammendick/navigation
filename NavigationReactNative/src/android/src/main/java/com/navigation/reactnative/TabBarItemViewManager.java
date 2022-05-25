package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVTabBarItemManagerDelegate;
import com.facebook.react.viewmanagers.NVTabBarItemManagerInterface;

import java.util.Map;

import javax.annotation.Nonnull;

public class TabBarItemViewManager extends ViewGroupManager<TabBarItemView> implements NVTabBarItemManagerInterface<TabBarItemView> {
    private final ViewManagerDelegate<TabBarItemView> delegate;

    public TabBarItemViewManager() {
        delegate = new NVTabBarItemManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<TabBarItemView> getDelegate() {
        return delegate;
    }

    @Nonnull
    @Override
    public String getName() {
        return "NVTabBarItem";
    }

    @ReactProp(name = "title")
    public void setTitle(TabBarItemView view, String title) {
        view.setTitle(title);
    }

    @ReactProp(name = "fontFamily")
    public void setFontFamily(TabBarItemView view, String fontFamily) {
        view.setFontFamily(fontFamily);
    }

    @ReactProp(name = "fontWeight")
    public void setFontWeight(TabBarItemView view, String fontWeight) {
        view.setFontWeight(fontWeight);
    }

    @ReactProp(name = "fontStyle")
    public void setFontStyle(TabBarItemView view, String fontStyle) {
        view.setFontStyle(fontStyle);
    }

    @Override
    @ReactProp(name = "fontSize")
    public void setFontSize(TabBarItemView view, float fontSize) {
        view.setFontSize((int) fontSize);
    }

    @ReactProp(name = "image")
    public void setImage(TabBarItemView view, @Nullable ReadableMap icon) {
        view.setIconSource(icon);
    }

    @Override
    public void setSystemItem(TabBarItemView view, @Nullable String value) {
    }

    @ReactProp(name = "testID")
    public void setTestID(TabBarItemView view, String testID) {
        view.setTestID(testID);
    }

    @Override
    @ReactProp(name = "badge")
    public void setBadge(TabBarItemView view, @Nullable String badge) {
        view.setBadge(badge != null ? Integer.parseInt(badge) : null);
    }

    @Override
    @ReactProp(name = "badgeColor", customType = "Color")
    public void setBadgeColor(TabBarItemView view, @Nullable Integer badgeColor) {
        view.setBadgeColor(badgeColor);
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull TabBarItemView view) {
        super.onAfterUpdateTransaction(view);
        view.styleTitle();
    }

    @Nonnull
    @Override
    protected TabBarItemView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new TabBarItemView(reactContext);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topOnPress", MapBuilder.of("registrationName", "onPress"))
            .build();
    }

    @Override
    public int getChildCount(TabBarItemView parent) {
        return parent.content.size();
    }

    @Override
    public View getChildAt(TabBarItemView parent, int index) {
        return parent.content.get(index);
    }

    @Override
    public void addView(TabBarItemView parent, View child, int index) {
        parent.content.add(index, child);
    }

    @Override
    public void removeViewAt(TabBarItemView parent, int index) {
        parent.content.remove(index);
    }
}

