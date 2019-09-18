package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

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
        view.setName(name);
    }

    @ReactProp(name = "enterTransition")
    public void setEnterTransition(SharedElementView view, String enterTransition) {
        view.enterTransition = enterTransition;
    }

    @ReactProp(name = "exitTransition")
    public void setExitTransition(SharedElementView view, String exitTransition) {
        view.exitTransition = exitTransition;
    }
}
