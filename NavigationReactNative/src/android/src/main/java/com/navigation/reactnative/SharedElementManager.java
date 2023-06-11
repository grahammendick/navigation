package com.navigation.reactnative;

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
        if (view.getChildCount() > 0)
            view.getChildAt(0).setTransitionName("element__" + name);
    }

    @ReactProp(name = "duration", defaultInt = -1)
    public void setDuration(SharedElementView view, int duration) {
        view.duration = duration;
    }

    @ReactProp(name = "fadeMode")
    public void setFadeMode(SharedElementView view, String fadeMode) {
        if (fadeMode == null) view.fadeMode = MaterialContainerTransform.FADE_MODE_IN;
        if (("in").equals(fadeMode)) view.fadeMode = MaterialContainerTransform.FADE_MODE_IN;
        if (("out").equals(fadeMode)) view.fadeMode = MaterialContainerTransform.FADE_MODE_OUT;
        if (("cross").equals(fadeMode)) view.fadeMode = MaterialContainerTransform.FADE_MODE_CROSS;
        if (("through").equals(fadeMode)) view.fadeMode = MaterialContainerTransform.FADE_MODE_THROUGH;
    }
}
