package com.navigation.reactnative;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

public class SearchResultsManager extends ViewGroupManager<SearchResultsView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVSearchResults";
    }

    @ReactProp(name = "text")
    public void setText(SearchResultsView view, String text) {
        view.setText(text);
    }

    @ReactProp(name = "placeholder")
    public void setPlaceholder(SearchResultsView view, String placeholder) {
        view.setHint(placeholder);
    }

    @ReactProp(name = "barTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBarTintColor(SearchResultsView view, int barTintColor) {
        if (barTintColor != Integer.MAX_VALUE)
            view.getToolbar().setBackgroundColor(barTintColor);
        else
            view.getToolbar().setBackground(view.defaultBackground);
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(SearchResultsView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
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