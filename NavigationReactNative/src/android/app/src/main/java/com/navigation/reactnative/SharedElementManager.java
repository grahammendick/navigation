package com.navigation.reactnative;

import android.annotation.SuppressLint;
import android.view.View;
import android.widget.FrameLayout;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.HashSet;

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
    public void setName(FrameLayout view, String name) {
        View rootView = view.getRootView();
        HashSet<View> sharedElements = (HashSet<View>) rootView.getTag(R.id.sharedElements);
        if (sharedElements == null) {
            sharedElements = new HashSet<>();
            rootView.setTag(R.id.sharedElements, sharedElements);
        }
        if (!sharedElements.contains(view))
            sharedElements.add(view);
        view.setTransitionName(name);
    }

    @Override
    public void onDropViewInstance(FrameLayout view) {
        View rootView = view.getRootView();
        HashSet<View> sharedElements = (HashSet<View>) rootView.getTag(R.id.sharedElements);
        if (sharedElements != null && sharedElements.contains(view))
            sharedElements.remove(view);
        super.onDropViewInstance(view);
    }
}
