package com.navigation.reactnative;

import android.text.InputType;

import androidx.annotation.Nullable;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVSearchBarManagerDelegate;
import com.facebook.react.viewmanagers.NVSearchBarManagerInterface;
import com.facebook.react.viewmanagers.NVStatusBarManagerDelegate;
import com.facebook.react.viewmanagers.NVStatusBarManagerInterface;
import com.google.android.material.appbar.AppBarLayout;

import java.util.Map;

import javax.annotation.Nonnull;

public class SearchBarViewManager extends ViewGroupManager<SearchBarView> implements NVSearchBarManagerInterface<SearchBarView> {
    private final ViewManagerDelegate<SearchBarView> delegate;

    public SearchBarViewManager() {
        delegate = new NVSearchBarManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<SearchBarView> getDelegate() {
        return delegate;
    }

    @Nonnull
    @Override
    public String getName() {
        return "NVSearchBar";
    }

    @Override
    public void setObscureBackground(SearchBarView view, boolean value) {
    }

    @Override
    public void setHideNavigationBar(SearchBarView view, boolean value) {
    }

    @Override
    public void setHideWhenScrolling(SearchBarView view, boolean value) {
    }

    @Override
    public void setAutoCapitalize(SearchBarView view, @Nullable String value) {
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

    @Override
    public void setMostRecentButtonEventCount(SearchBarView view, int value) {
    }

    @Override
    public void setScopeButton(SearchBarView view, int value) {
    }

    @Override
    public void setScopeButtons(SearchBarView view, @Nullable ReadableArray value) {
    }

    @ReactProp(name = "autoCapitalize")
    public void setAutoCapitalize(SearchBarView view, int autoCapitalize) {
        view.searchView.setInputType(autoCapitalize);
    }

    @Override
    @ReactProp(name = "barTintColor", customType = "Color")
    public void setBarTintColor(SearchBarView view, @Nullable Integer barTintColor) {
        view.setBarTintColor(barTintColor);

    }

    @ReactProp(name = "bottomBar")
    public void setBottomBar(SearchBarView view, boolean bottomBar) {
        view.bottomBar = bottomBar;
        CoordinatorLayout.LayoutParams params = (CoordinatorLayout.LayoutParams) view.getLayoutParams();
        if (!bottomBar) {
            params.bottomMargin = 0;
            AppBarLayout.ScrollingViewBehavior behavior = new AppBarLayout.ScrollingViewBehavior();
            params.setBehavior(behavior);
        } else {
            params.bottomMargin = (int) PixelUtil.toPixelFromDIP(56);
            params.setBehavior(null);
        }
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
            .put("onExpand", MapBuilder.of("registrationName", "onExpand"))
            .put("onCollapse", MapBuilder.of("registrationName", "onCollapse"))
            .build();
    }

    @Override
    public Map<String, Object> getExportedViewConstants() {
        return MapBuilder.<String, Object>of(
            "AutoCapitalize",
            MapBuilder.of(
                "none", InputType.TYPE_CLASS_TEXT,
                "words", InputType.TYPE_TEXT_FLAG_CAP_WORDS,
                "sentences", InputType.TYPE_TEXT_FLAG_CAP_SENTENCES,
                "allCharacters", InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS));
    }
}