package com.navigation.reactnative;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVSharedElementManagerDelegate;
import com.facebook.react.viewmanagers.NVSharedElementManagerInterface;
import com.google.android.material.transition.MaterialContainerTransform;

import javax.annotation.Nonnull;

public class SharedElementViewManager extends ViewGroupManager<SharedElementView> implements NVSharedElementManagerInterface<SharedElementView> {
    private final ViewManagerDelegate<SharedElementView> delegate;

    public SharedElementViewManager() {
        delegate = new NVSharedElementManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<SharedElementView> getDelegate() {
        return delegate;
    }

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

    @ReactProp(name = "duration")
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
