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
    protected String title;
    private Drawable icon;
    private OnIconListener onIconListener;
    private IconResolver.IconResolverListener tabIconResolverListener;

    public TabBarItemView(Context context) {
        super(context);
        tabIconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                icon = d;
                if (onIconListener != null)
                    onIconListener.onIconResolve(icon);
            }
        };
    }

    void setIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, tabIconResolverListener, getContext());
    }

    void setOnIconListener(OnIconListener onIconListener) {
        this.onIconListener = onIconListener;
        if (icon!= null)
            this.onIconListener.onIconResolve(icon);

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

    interface OnIconListener {
        void onIconResolve(Drawable icon);
    }
}
