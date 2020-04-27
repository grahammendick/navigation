package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.List;

public class TabBarItemView extends ViewGroup {
    protected int index;
    protected String title;
    private Drawable icon;
    private TabView tabView;
    List<View> content = new ArrayList<>();
    private IconResolver.IconResolverListener tabIconResolverListener;

    public TabBarItemView(Context context) {
        super(context);
        tabIconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                icon = d;
                if (tabView != null)
                    tabView.setIcon(index, icon);
            }
        };
    }

    void setTitle(String title) {
        this.title = title;
        if (tabView != null)
            tabView.setTitle(index, title);
    }

    void setIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, tabIconResolverListener, getContext());
    }

    void setTabView(TabView tabView, int index) {
        this.tabView = tabView;
        this.index = index;
        if (icon != null)
            tabView.setIcon(index, icon);
    }

    protected void pressed() {
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onPress", null);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
