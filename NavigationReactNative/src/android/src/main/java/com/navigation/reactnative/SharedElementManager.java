package com.navigation.reactnative;

import android.view.View;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.material.transition.MaterialContainerTransform;

import javax.annotation.Nonnull;

public class SharedElementManager extends ViewGroupManager<SharedElementView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVSharedElement";
    }

    @Nonnull
    @Override
    protected SharedElementView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new SharedElementView(reactContext);
    }

    @ReactProp(name = "name")
    public void setName(SharedElementView view, String name) {
        view.setTransitionName(name);
    }

    @ReactProp(name = "duration", defaultInt = -1)
    public void setDuration(SharedElementView view, int duration) {
        view.transition.setDuration(duration != -1 ? duration : view.defaultDuration);
    }

    @ReactProp(name = "fadeMode")
    public void setFadeMode(SharedElementView view, String fadeMode) {
        if (fadeMode == null) view.transition.setFadeMode(view.defaultFadeMode);
        if (fadeMode == "in") view.transition.setFadeMode(MaterialContainerTransform.FADE_MODE_IN);
        if (fadeMode == "out") view.transition.setFadeMode(MaterialContainerTransform.FADE_MODE_OUT);
        if (fadeMode == "cross") view.transition.setFadeMode(MaterialContainerTransform.FADE_MODE_CROSS);
        if (fadeMode == "through") view.transition.setFadeMode(MaterialContainerTransform.FADE_MODE_THROUGH);
    }

    @ReactProp(name = "drawingViewId", defaultInt = View.NO_ID)
    public void setDrawingViewId(SharedElementView view, int drawingViewId) {
        view.transition.setDrawingViewId(drawingViewId);
    }
}
