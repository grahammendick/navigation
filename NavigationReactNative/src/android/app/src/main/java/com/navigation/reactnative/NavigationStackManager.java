package com.navigation.reactnative;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nonnull;

public class NavigationStackManager extends ViewGroupManager<NavigationStackView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVNavigationStack";
    }

    @ReactProp(name = "keys")
    public void setkeys(NavigationStackView view, ReadableArray keys) {
        view.keys = keys;
    }

    @ReactProp(name = "fragmentMode")
    public void setFragmentMode(NavigationStackView view, Boolean fragmentMode) {
        view.navigator = !fragmentMode ? new ActivityNavigator() : new FragmentNavigator();
    }

    @ReactProp(name = "enterAnim")
    public void setEnterAnim(NavigationStackView view, String enterAnim) {
        view.enterAnim = enterAnim;
    }

    @ReactProp(name = "exitAnim")
    public void setExitAnim(NavigationStackView view, String exitAnim) {
        view.exitAnim = exitAnim;
    }

    @ReactProp(name = "sharedElements")
    public void setSharedElements(NavigationStackView view, ReadableArray sharedElements) {
        view.sharedElementNames = sharedElements;
    }

    @ReactProp(name = "oldSharedElements")
    public void setOldSharedElements(NavigationStackView view, ReadableArray oldSharedElements) {
        view.oldSharedElementNames = oldSharedElements;
    }

    @ReactProp(name = "primary")
    public void setPrimary(NavigationStackView view, boolean primary) {
        view.primary = primary;
    }

    @ReactProp(name = "finish")
    public void setFinish(NavigationStackView view, boolean finish) {
        view.finish = finish;
    }

    @Nonnull
    @Override
    protected NavigationStackView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new NavigationStackView(reactContext);
    }

    @Override
    protected void onAfterUpdateTransaction(@Nonnull NavigationStackView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }
}
