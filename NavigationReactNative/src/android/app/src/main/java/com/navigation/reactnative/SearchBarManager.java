package com.navigation.reactnative;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

public class SearchBarManager extends ViewGroupManager<SearchBarView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVSearchBar";
    }

    @ReactProp(name = "placeholder")
    public void setPlaceholder(SearchBarView view, String placeholder) {
        view.searchView.setQueryHint(placeholder);
    }

    @ReactProp(name = "text")
    public void setText(SearchBarView view, String text) {
        view.setQuery(text);
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(SearchBarView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
    }

    @Nonnull
    @Override
    protected SearchBarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new SearchBarView(reactContext);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("onChangeText", MapBuilder.of("registrationName", "onChangeText"))
            .put("onShow", MapBuilder.of("registrationName", "onShow"))
            .build();
    }
}