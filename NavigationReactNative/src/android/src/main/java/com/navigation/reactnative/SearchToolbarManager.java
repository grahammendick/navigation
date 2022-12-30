package com.navigation.reactnative;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nonnull;

public class SearchToolbarManager extends ViewGroupManager<SearchToolbarView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVSearchToolbar";
    }

    @ReactProp(name = "placeholder")
    public void setPlaceholder(SearchToolbarView view, String placeholder) {
    }

    @ReactProp(name = "navigationImage")
    public void setNavIcon(SearchToolbarView view, ReadableMap navIcon) {
        view.setNavIconSource(navIcon);
    }

    @ReactProp(name = "barTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBarTintColor(SearchToolbarView view, int barTintColor) {
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
}