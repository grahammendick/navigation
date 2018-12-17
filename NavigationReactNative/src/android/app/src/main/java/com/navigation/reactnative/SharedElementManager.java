package com.navigation.reactnative;

import android.annotation.SuppressLint;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;

import javax.annotation.Nullable;

public class SharedElementManager extends ViewGroupManager<ReactViewGroup> {

    @Override
    public String getName() {
        return "NVSharedElement";
    }

    @Override
    protected ReactViewGroup createViewInstance(ThemedReactContext reactContext) {
        return new ReactViewGroup(reactContext);
    }

    @SuppressLint("NewApi")
    @ReactProp(name = "name")
    public void setName(ReactViewGroup view, @Nullable String name) {
        view.setTransitionName(name);
    }
}
