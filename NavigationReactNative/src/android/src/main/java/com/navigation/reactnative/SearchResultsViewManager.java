package com.navigation.reactnative;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVSearchResultsManagerDelegate;
import com.facebook.react.viewmanagers.NVSearchResultsManagerInterface;

import java.util.Map;

@ReactModule(name = "NVSearchResults")
public class SearchResultsViewManager extends ViewGroupManager<SearchResultsView> implements NVSearchResultsManagerInterface<SearchResultsView> {
    private final ViewManagerDelegate<SearchResultsView> delegate;

    public SearchResultsViewManager() {
        delegate = new NVSearchResultsManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<SearchResultsView> getDelegate() {
        return delegate;
    }

    @NonNull
    @Override
    public String getName() {
        return "NVSearchResults";
    }

    @NonNull
    @Override
    protected SearchResultsView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new SearchResultsView(themedReactContext);
    }

    @Override
    @ReactProp(name = "placeholder")
    public void setPlaceholder(SearchResultsView view, @Nullable String placeholder) {
        view.setHint(placeholder);
    }

    @Override
    @ReactProp(name = "text")
    public void setText(SearchResultsView view, @Nullable String text) {
        view.setText(text);
    }

    @Override
    @ReactProp(name = "active")
    public void setActive(SearchResultsView view, boolean active) {
        view.setActive(active);
    }

    @Override
    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(SearchResultsView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
    }

    @Override
    @ReactProp(name = "mostRecentActiveEventCount")
    public void setMostRecentActiveEventCount(SearchResultsView view, int mostRecentActiveEventCount) {
        view.mostRecentActiveEventCount = mostRecentActiveEventCount;
    }

    @Override
    @ReactProp(name = "barTintColor", customType = "Color")
    public void setBarTintColor(SearchResultsView view, @Nullable Integer barTintColor) {
        if (barTintColor != null)
            view.getToolbar().setBackgroundColor(barTintColor);
        else
            view.getToolbar().setBackground(view.defaultBackground);
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topOnChangeText", MapBuilder.of("registrationName", "onChangeText"))
            .put("topOnChangeActive", MapBuilder.of("registrationName", "onChangeActive"))
            .build();
    }
}
