package com.navigation.reactnative;

import android.content.Context;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.ViewTreeObserver;

public class SharedElementView extends ViewGroup {
    private SceneView scene;

    public SharedElementView(Context context) {
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
        scene = (SceneView) ancestor;
        scene.sharedElements.add(this);
        getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
                getViewTreeObserver().removeOnPreDrawListener(this);
                if (scene.transitioner != null)
                    scene.transitioner.load(SharedElementView.this);
                return true;
            }
        });
    }

    @Override
    protected void onLayout(boolean b, int i, int i1, int i2, int i3) {
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        scene = null;
    }
}
