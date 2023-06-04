package com.navigation.reactnative;

import android.content.Context;
import android.os.Build;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.ViewTreeObserver;

import androidx.transition.ChangeBounds;
import androidx.transition.ChangeClipBounds;
import androidx.transition.ChangeImageTransform;
import androidx.transition.ChangeTransform;
import androidx.transition.Transition;
import androidx.transition.TransitionSet;

import com.google.android.material.transition.MaterialContainerTransform;

public class SharedElementView extends ViewGroup {
    final Transition transition;
    final long defaultDuration;
    final int defaultFadeMode;

    public SharedElementView(Context context) {
        super(context);
        TransitionSet transitionSet = new TransitionSet();
        transitionSet.addTransition(new ChangeBounds());
        transitionSet.addTransition(new ChangeTransform());
        transitionSet.addTransition(new ChangeClipBounds());
        transitionSet.addTransition(new ChangeImageTransform());
        transition = transitionSet;
        defaultDuration = transition.getDuration();
        defaultFadeMode = 0;
    }

    @Override
    public void addView(View child, int index) {
        super.addView(child, index);
        if (index == 0) child.setTransitionName("element__" + this.getTransitionName());
    }

    @Override
    public void endViewTransition(View view) {
        super.endViewTransition(view);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            view.setTransitionAlpha(1);
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        final SceneView scene = getScene();
        if (scene == null) return;
        scene.sharedElements.add(this);
        getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
                getViewTreeObserver().removeOnPreDrawListener(this);
                if (scene.sharedElementMotion != null)
                    scene.sharedElementMotion.load(SharedElementView.this);
                return true;
            }
        });
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        SceneView scene = getScene();
        if (scene != null) scene.sharedElements.remove(this);
    }

    private SceneView getScene() {
        ViewParent ancestor = getParent();
        while (ancestor != null && !(ancestor instanceof SceneView))
            ancestor = ancestor.getParent();
        if (ancestor == null)
            return null;
        return (SceneView) ancestor;
    }

    @Override
    protected void onLayout(boolean b, int i, int i1, int i2, int i3) {
    }
}
