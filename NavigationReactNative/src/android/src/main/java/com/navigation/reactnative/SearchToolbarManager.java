package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

public class SearchToolbarManager extends ViewGroupManager<SearchToolbarView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVSearchToolbar";
    }

    @ReactProp(name = "placeholder")
    public void setPlaceholder(SearchToolbarView view, String placeholder) {
        view.setHint(placeholder);
    }

    @ReactProp(name = "fontFamily")
    public void setFontFamily(SearchToolbarView view, String fontFamily) {
        view.setFontFamily(fontFamily);
    }

    @ReactProp(name = "fontWeight")
    public void setFontWeight(SearchToolbarView view, String fontWeight) {
        view.setFontWeight(fontWeight);
    }

    @ReactProp(name = "fontStyle")
    public void setFontStyle(SearchToolbarView view, String fontStyle) {
        view.setFontStyle(fontStyle);
    }

    @ReactProp(name = "fontSize")
    public void setFontSize(SearchToolbarView view, Integer fontSize) {
        view.setFontSize(fontSize);
    }

    @ReactProp(name = "navigationImage")
    public void setNavIcon(SearchToolbarView view, ReadableMap navIcon) {
        view.setNavIconSource(navIcon);
    }

    @ReactProp(name = "navigationAccessibilityLabel")
    public void setNavigationContentDescription(SearchToolbarView view, String navigationContentDescription) {
        view.setNavigationContentDescription(navigationContentDescription);
    }

    @ReactProp(name = "overflowImage")
    public void setOverflowIcon(SearchToolbarView view, ReadableMap overflowIcon) {
        view.setOverflowIconSource(overflowIcon);
    }

    @ReactProp(name = "barTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBarTintColor(SearchToolbarView view, int barTintColor) {
        if (barTintColor != Integer.MAX_VALUE)
            view.setBarTintColor(barTintColor);
        else
            view.setBackground(view.defaultBackground);
    }

    @ReactProp(name = "tintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setTintColor(SearchToolbarView view, int tintColor) {
        view.setTintColor(tintColor != Integer.MAX_VALUE ? tintColor : null);
    }

    @ReactProp(name = "navigationDecorative")
    public void setNavigationDecorative(SearchToolbarView view, boolean navigationDecorative) {
        if (!navigationDecorative)
            view.addNavigationListener();
        else
            view.setNavigationOnClickListener(null);
    }

    @ReactProp(name = "navigationTestID")
    public void setNavigationTestID(SearchToolbarView view, String navigationTestID) {
        view.setNavigationTestID(navigationTestID);
    }

    @ReactProp(name = "overflowTestID")
    public void setOverflowTestID(SearchToolbarView view, String overflowTestID) {
        view.setOverflowTestID(overflowTestID);
    }

    @Override
    public void addView(SearchToolbarView parent, View child, int index) {
        parent.children.add(index, (BarButtonView) child);
        parent.setMenuItems();
    }

    @Override
    public void removeViewAt(SearchToolbarView parent, int index) {
        parent.children.remove(index);
        parent.setMenuItems();
    }

    @Override
    public int getChildCount(SearchToolbarView parent) {
        return parent.children.size();
    }

    @Override
    public View getChildAt(SearchToolbarView parent, int index) {
        return parent.children.get(index);
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    @Nonnull
    @Override
    protected SearchToolbarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new SearchToolbarView(reactContext);
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull SearchToolbarView view) {
        super.onAfterUpdateTransaction(view);
        view.stylePlaceholder();
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topOnNavigationPress", MapBuilder.of("registrationName", "onNavigationPress"))
            .build();
    }
}
