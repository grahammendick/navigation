package com.navigation.reactnative;

import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.core.view.ViewCompat;

import com.facebook.react.bridge.ReactContext;

public class StatusBarView extends ViewGroup {

    public StatusBarView(Context context) {
        super(context);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        ViewParent ancestor = getParent();
        while (ancestor != null && !(ancestor instanceof SceneView))
            ancestor = ancestor.getParent();
        if (ancestor == null)
            return;
        SceneView scene = (SceneView) ancestor;
        scene.statusBar = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
            ((ReactContext) getContext()).getCurrentActivity().getWindow().setStatusBarColor(SceneFragment.defaultStatusBarColor);
    }

    void onAfterUpdateTransaction() {
        if (ViewCompat.isAttachedToWindow(this)) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
                ((ReactContext) getContext()).getCurrentActivity().getWindow().setStatusBarColor(Color.RED);
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
