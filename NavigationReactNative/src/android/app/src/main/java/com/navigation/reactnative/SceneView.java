package com.navigation.reactnative;

import android.view.ViewGroup;

import com.facebook.react.uimanager.ThemedReactContext;

public class SceneView extends ViewGroup {

    public SceneView(ThemedReactContext context) {
        super(context);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
