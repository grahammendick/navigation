package com.navigation.reactnative;

import android.view.ViewGroup;

import com.facebook.react.uimanager.ThemedReactContext;

public class SceneView extends ViewGroup {
    private String enterAnim;
    private String exitAnim;

    public SceneView(ThemedReactContext context) {
        super(context);
    }

    public String getEnterAnim() {
        return enterAnim;
    }

    public void setEnterAnim(String enterAnim) {
        this.enterAnim = enterAnim;
    }

    public String getExitAnim() {
        return exitAnim;
    }

    public void setExitAnim(String exitAnim) {
        this.exitAnim = exitAnim;
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
