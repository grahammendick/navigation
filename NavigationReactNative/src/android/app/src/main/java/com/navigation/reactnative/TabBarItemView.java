package com.navigation.reactnative;

import android.content.Context;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.imagehelper.ResourceDrawableIdHelper;

public class TabBarItemView extends ViewGroup implements NavigationBoundary {
    Fragment fragment;
    protected String title;
    Integer imageResource;

    public TabBarItemView(Context context) {
        super(context);
    }

    void setImage(String image) {
        imageResource = image != null ? ResourceDrawableIdHelper.getInstance().getResourceDrawableId(getContext(), image) : null;
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
