package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class SharedElementManager extends ViewGroupManager<SharedElementView> {

    @Override
    public String getName() {
        return "NVSharedElement";
    }

    @Override
    protected SharedElementView createViewInstance(ThemedReactContext reactContext) {
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
