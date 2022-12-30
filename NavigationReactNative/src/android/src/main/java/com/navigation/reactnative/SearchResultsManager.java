package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class SearchResultsManager extends ViewGroupManager<SearchResultsView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVSearchResults";
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    @Nonnull
    @Override
    protected SearchResultsView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new SearchResultsView(reactContext);
    }
}