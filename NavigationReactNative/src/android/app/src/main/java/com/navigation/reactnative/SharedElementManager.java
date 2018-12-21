package com.navigation.reactnative;

import android.annotation.SuppressLint;
import android.widget.FrameLayout;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

public class SharedElementManager extends ViewGroupManager<FrameLayout> {

    @Override
    public String getName() {
        return "NVSharedElement";
    }

    @Override
    protected FrameLayout createViewInstance(ThemedReactContext reactContext) {
        return new FrameLayout(reactContext);
    }

    @SuppressLint("NewApi")
    @ReactProp(name = "name")
    public void setName(FrameLayout view, @Nullable String name) {
        view.setTransitionName(name);
    }
}
