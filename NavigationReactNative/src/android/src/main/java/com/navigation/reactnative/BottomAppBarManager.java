package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class BottomAppBarManager extends ViewGroupManager<BottomAppBarView> {
    @NonNull
    @Override
    public String getName() {
        return "NVBottomAppBar";
    }

    @NonNull
    @Override
    protected BottomAppBarView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new BottomAppBarView(reactContext);
    }

    @ReactProp(name = "navigationImage")
    public void setNavIcon(BottomAppBarView view, ReadableMap navIcon) {
        view.setNavIconSource(navIcon);
    }

    @ReactProp(name = "overflowImage")
    public void setOverflowIcon(BottomAppBarView view, ReadableMap overflowIcon) {
        view.setOverflowIconSource(overflowIcon);
    }

    @ReactProp(name = "barTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBarTintColor(BottomAppBarView view, int barTintColor) {
        if (barTintColor != Integer.MAX_VALUE)
            view.setBackgroundColor(barTintColor);
        else
            view.setBackground(null);
    }

    @ReactProp(name = "tintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setTintColor(BottomAppBarView view, int tintColor) {
        view.setTintColor(tintColor != Integer.MAX_VALUE ? tintColor : null);
    }

    @ReactProp(name = "height")
    public void setHeight(BottomAppBarView view, double height) {
        view.getLayoutParams().height = (int) PixelUtil.toPixelFromDIP(height);
    }

    @Override
    public void addView(BottomAppBarView parent, View child, int index) {
        parent.children.add(index, child);
        parent.setMenuItems();
    }

    @Override
    public void removeViewAt(BottomAppBarView parent, int index) {
        parent.children.remove(index);
        parent.setMenuItems();
    }

    @Override
    public int getChildCount(BottomAppBarView parent) {
        return parent.children.size();
    }

    @Override
    public View getChildAt(BottomAppBarView parent, int index) {
        return parent.children.get(index);
    }
}
