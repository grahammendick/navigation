package com.navigation.reactnative;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import java.util.Map;

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

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topOnChangeText", MapBuilder.of("registrationName", "onChangeText"))
            .put("topOnExpand", MapBuilder.of("registrationName", "onExpand"))
            .put("topOnCollapse", MapBuilder.of("registrationName", "onCollapse"))
            .build();
    }
}