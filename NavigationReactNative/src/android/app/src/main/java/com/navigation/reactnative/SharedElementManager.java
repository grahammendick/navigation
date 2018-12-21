package com.navigation.reactnative;

import android.annotation.SuppressLint;
import android.view.View;
import android.view.ViewTreeObserver;
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
        FrameLayout view = new FrameLayout(reactContext);
        view.getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
                view.getViewTreeObserver().removeOnPreDrawListener(this);
                View rootView = view.getRootView();
                HashSet<View> sharedElements = (HashSet<View>) rootView.getTag(R.id.sharedElements);
                if (sharedElements == null) {
                    sharedElements = new HashSet<>();
                    rootView.setTag(R.id.sharedElements, sharedElements);
                }
                sharedElements.add(view);
                return true;
            }
        });
        return view;
    }

    @SuppressLint("NewApi")
    @ReactProp(name = "name")
    public void setName(FrameLayout view, String name) {
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
