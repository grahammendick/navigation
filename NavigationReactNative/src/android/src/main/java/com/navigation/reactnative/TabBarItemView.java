package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.view.ViewGroup;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class TabBarItemView extends ViewGroup implements NavigationBoundary {
    Fragment fragment;
    protected int index;
    protected String title;
    private Drawable icon;
    private IconResolver.IconResolverListener tabIconResolverListener;
    private Integer badge;
    private Integer badgeColor;
    private TabView tabView;
    private Integer defaultBadgeColor;

    public TabBarItemView(Context context) {
        super(context);
        tabIconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                icon = d;
                if (tabView != null) {
                    tabView.setIcon(index, icon);
                    post(tabView.getMeasureAndLayout());
                }
            }
        };
    }

    void setIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, tabIconResolverListener, getContext());
    }

    void setBadge(@Nullable Integer badge) {
        this.badge = badge;
        if (tabView == null)
            return;
        if (badge != null)
            tabView.getBadgeIcon(index).setNumber(badge);
        else
            tabView.removeBadgeIcon(index);
        setBadgeColor(badgeColor);
    }

    void setBadgeColor(@Nullable Integer badgeColor) {
        this.badgeColor = badgeColor;
        if (tabView == null || badge == null)
            return;
        if (defaultBadgeColor == null)
            defaultBadgeColor = tabView.getBadgeIcon(index).getBackgroundColor();
        if (badgeColor != null)
            tabView.getBadgeIcon(index).setBackgroundColor(badgeColor);
        else
            tabView.getBadgeIcon(index).setBackgroundColor(defaultBadgeColor);
    }

    void setTabView(TabView tabView) {
        this.tabView = tabView;
        if (icon != null)
            tabView.setIcon(index, icon);
        setBadge(badge);
    }

    protected void pressed() {
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onPress", null);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    public Fragment getFragment() {
        return fragment;
    }
}
