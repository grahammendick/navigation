package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class SearchBarManager extends ViewGroupManager<SearchBarView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVSearchBar";
    }

    @Nonnull
    @Override
    protected SearchBarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new SearchBarView(reactContext);
    }
}