package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.search.SearchBar;

public class SearchToolbarView extends SearchBar {
    private final IconResolver.IconResolverListener navIconResolverListener;
    final Drawable defaultBackground;

    public SearchToolbarView(Context context) {
        super(context);
        AppBarLayout.LayoutParams params = new AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT);
        params.setScrollFlags(AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL | AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS);
        setLayoutParams(params);
        defaultBackground = getBackground();
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
