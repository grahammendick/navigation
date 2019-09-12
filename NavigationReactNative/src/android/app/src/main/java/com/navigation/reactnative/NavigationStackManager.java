package com.navigation.reactnative;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class NavigationStackManager extends ViewGroupManager<NavigationStackView> {

    @Override
    public String getName() {
        return "NVNavigationStack";
    }

    @ReactProp(name = "keys")
    public void setkeys(NavigationStackView view, ReadableArray keys) {
        view.keys = keys;
    }

    @ReactProp(name = "enterAnim")
    public void setEnterAnim(NavigationStackView view, String enterAnim) {
        view.enterAnim = enterAnim;
    }

    @ReactProp(name = "exitAnim")
    public void setExitAnim(NavigationStackView view, String exitAnim) {
        view.exitAnim = exitAnim;
    }

    @ReactProp(name = "popEnterAnim")
    public void setPopEnterAnim(NavigationStackView view, String popEnterAnim) {
        view.popEnterAnim= popEnterAnim;
    }

    @ReactProp(name = "popExitAnim")
    public void setPopExitAnim(NavigationStackView view, String popExitAnim) {
        view.popExitAnim = popExitAnim;
    }

    @ReactProp(name = "sharedElements")
    public void setSharedElements(NavigationStackView view, ReadableArray sharedElements) {
        view.sharedElementNames = sharedElements;
    }

    @ReactProp(name = "oldSharedElements")
    public void setOldSharedElements(NavigationStackView view, ReadableArray oldSharedElements) {
        view.oldSharedElementNames = oldSharedElements;
    }

    @ReactProp(name = "finish")
    public void setFinish(NavigationStackView view, boolean finish) {
        view.finish = finish;
    }

    @Override
    public NavigationStackView createViewInstance(ThemedReactContext context) {
        return new NavigationStackView(context);
    }

    @Override
    protected void onAfterUpdateTransaction(NavigationStackView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }
}
