package com.navigation.reactnative;

import android.content.Context;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.google.android.material.search.SearchBar;

public class SearchToolbarView extends SearchBar {
    private final IconResolver.IconResolverListener navIconResolverListener;

    public SearchToolbarView(Context context) {
        super(context);
        navIconResolverListener = d -> {
            setNavigationIcon(d);
        };
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        getParent().requestLayout();
    }

    void setNavIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, navIconResolverListener, getContext());
    }
}
