package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

public class TabBarItemManager extends ViewGroupManager<TabBarItemView> {

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

    @ReactProp(name = "fontSize")
    public void setFontSize(TabBarItemView view, Integer fontSize) {
        view.setFontSize(fontSize);
    }

    @ReactProp(name = "image")
    public void setImage(TabBarItemView view, @Nullable ReadableMap icon) {
        view.setIconSource(icon);
    }

    @ReactProp(name = "badge")
    public void setBadge(TabBarItemView view, @Nullable String badge) {
        view.setBadge(badge != null ? Integer.parseInt(badge) : null);
    }

    @ReactProp(name = "badgeColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBadgeColor(TabBarItemView view, int badgeColor) {
        view.setBadgeColor(badgeColor != Integer.MAX_VALUE ? badgeColor : null);
    }

    @ReactProp(name = "testID")
    public void setTestID(TabBarItemView view, String testID) {
        view.setTestID(testID);
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
        if (parent.changeListener != null) {
            parent.changeListener.onChange(parent);
        }
    }

    @Override
    public void removeViewAt(TabBarItemView parent, int index) {
        parent.content.remove(index);
    }
}

