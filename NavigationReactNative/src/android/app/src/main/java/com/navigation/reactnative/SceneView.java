package com.navigation.reactnative;

import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.uimanager.ThemedReactContext;

public class SceneView extends ViewGroup {

    public SceneView(ThemedReactContext context) {
        super(context);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        View child = getChildAt(0);
        if (child != null && child.getClass().getSimpleName().contains("DrawerLayout")) {
            child.requestLayout();
            post(measureAndLayout);
        }
    }

    private final Runnable measureAndLayout =
        new Runnable() {
            @Override
            public void run() {
                View child = getChildAt(0);
                child.measure(
                    MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
                child.layout(child.getLeft(), child.getTop(), child.getRight(), child.getBottom());
            }
        };

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
