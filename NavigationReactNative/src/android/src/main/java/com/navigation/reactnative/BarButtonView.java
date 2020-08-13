package com.navigation.reactnative;

import android.content.Context;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.view.MenuItem;
import android.view.ViewGroup;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class BarButtonView extends ViewGroup {
    private String title;
    private int showAsAction;
    private boolean search;
    private MenuItem menuItem;
    private Integer tintColor;
    private Drawable icon;
    private IconResolver.IconResolverListener iconResolverListener;

    public BarButtonView(Context context) {
        super(context);
        iconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                icon = d;
                setTintColor(tintColor);
                if (menuItem != null)
                    menuItem.setIcon(d);
            }
        };
    }

    boolean getSearch() {
        return search;
    }

    void setTitle(String title) {
        this.title = title;
        if (menuItem != null)
            menuItem.setTitle(title);
    }

    void setIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, iconResolverListener, getContext());
    }

    void setShowAsAction(int showAsAction) {
        this.showAsAction = showAsAction;
        if (menuItem != null)
            menuItem.setShowAsAction(!search ? showAsAction : MenuItem.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW | showAsAction);
    }

    void setSearch(boolean search) {
        this.search = search;
        setShowAsAction(showAsAction);
    }

    void setMenuItem(MenuItem menuItem) {
        this.menuItem = menuItem;
        setTitle(title);
        menuItem.setIcon(icon);
        setShowAsAction(showAsAction);
        menuItem.setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onPress", null);
                return true;
            }
        });
    }

    void setTintColor(Integer tintColor) {
        this.tintColor = tintColor;
        if (icon != null) {
            if (tintColor != null)
                icon.setColorFilter(tintColor, PorterDuff.Mode.SRC_IN);
            else
                icon.clearColorFilter();
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
