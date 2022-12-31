package com.navigation.reactnative;

import android.content.res.ColorStateList;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.RippleDrawable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.material.shape.MaterialShapeDrawable;

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

    @ReactProp(name = "navigationImage")
    public void setNavIcon(SearchToolbarView view, ReadableMap navIcon) {
        view.setNavIconSource(navIcon);
    }

    @ReactProp(name = "barTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBarTintColor(SearchToolbarView view, int barTintColor) {
        if (barTintColor != Integer.MAX_VALUE) {
            Drawable drawable = view.defaultBackground;
            if (view.defaultBackground instanceof RippleDrawable)
                drawable = ((RippleDrawable) view.defaultBackground).getDrawable(0);
            if (drawable instanceof MaterialShapeDrawable) {
                drawable = drawable.getConstantState().newDrawable();
                ((MaterialShapeDrawable) drawable).setFillColor(ColorStateList.valueOf(barTintColor));
                view.setBackground(drawable);
            }
        }
        else
          view.setBackground(view.defaultBackground);
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