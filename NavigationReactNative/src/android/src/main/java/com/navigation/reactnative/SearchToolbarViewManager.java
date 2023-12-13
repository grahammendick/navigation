package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVSearchToolbarManagerDelegate;
import com.facebook.react.viewmanagers.NVSearchToolbarManagerInterface;

import java.util.Map;

@ReactModule(name = "NVSearchToolbar")
public class SearchToolbarViewManager extends ViewGroupManager<SearchToolbarView> implements NVSearchToolbarManagerInterface<SearchToolbarView> {
    private final ViewManagerDelegate<SearchToolbarView> delegate;

    public SearchToolbarViewManager() {
        delegate = new NVSearchToolbarManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<SearchToolbarView> getDelegate() {
        return delegate;
    }

    @NonNull
    @Override
    public String getName() {
        return "NVSearchToolbar";
    }

    @NonNull
    @Override
    protected SearchToolbarView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new SearchToolbarView(themedReactContext);
    }

    @Override
    @ReactProp(name = "placeholder")
    public void setPlaceholder(SearchToolbarView view, @Nullable String placeholder) {
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
    public void setFontSize(SearchToolbarView view, float fontSize) {
        view.setFontSize(fontSize != -1 ? (int) fontSize : null);
    }

    @Override
    @ReactProp(name = "barTintColor", customType = "Color")
    public void setBarTintColor(SearchToolbarView view, @Nullable Integer barTintColor) {
        if (barTintColor != null)
            view.setBarTintColor(barTintColor);
        else
            view.setBackground(view.defaultBackground);
    }

    @Override
    @ReactProp(name = "tintColor", customType = "Color")
    public void setTintColor(SearchToolbarView view, @Nullable Integer tintColor) {
        view.setTintColor(tintColor);
    }

    @Override
    @ReactProp(name = "navigationImage")
    public void setNavigationImage(SearchToolbarView view, @Nullable ReadableMap navIcon) {
        view.setNavIconSource(navIcon);
    }

    @Override
    @ReactProp(name = "navigationTestID")
    public void setNavigationTestID(SearchToolbarView view, @Nullable String navigationTestID) {
        view.setNavigationTestID(navigationTestID);
    }

    @Override
    @ReactProp(name = "navigationDecorative")
    public void setNavigationDecorative(SearchToolbarView view, boolean navigationDecorative) {
        if (!navigationDecorative)
            view.addNavigationListener();
        else
            view.setNavigationOnClickListener(null);
    }

    @Override
    @ReactProp(name = "navigationAccessibilityLabel")
    public void setNavigationAccessibilityLabel(SearchToolbarView view, @Nullable String navigationContentDescription) {
        view.setNavigationContentDescription(navigationContentDescription);
    }

    @Override
    @ReactProp(name = "overflowImage")
    public void setOverflowImage(SearchToolbarView view, @Nullable ReadableMap overflowIcon) {
        view.setOverflowIconSource(overflowIcon);
    }

    @Override
    @ReactProp(name = "overflowTestID")
    public void setOverflowTestID(SearchToolbarView view, @Nullable String overflowTestID) {
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
    protected void onAfterUpdateTransaction(@NonNull SearchToolbarView view) {
        super.onAfterUpdateTransaction(view);
        view.stylePlaceholder();
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topNavigationPress", MapBuilder.of("registrationName", "onNavigationPress"))
            .build();
    }
}
