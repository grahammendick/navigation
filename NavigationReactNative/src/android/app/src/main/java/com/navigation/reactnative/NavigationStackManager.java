package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nonnull;

public class NavigationStackManager extends ViewGroupManager<NavigationStackView> {

    @Override
    public String getName() {
        return "NVNavigationStack";
    }

    @ReactProp(name = "url")
    public void setUrl(NavigationStackView view, String url) {
    }

    @ReactProp(name = "oldUrl")
    public void setOldUrl(NavigationStackView view, String oldUrl) {
    }

    @ReactProp(name = "enterAnim")
    public void setEnterAnim(NavigationStackView view, String enterAnim) {
        view.setEnterAnim(enterAnim);
    }

    @ReactProp(name = "exitAnim")
    public void setExitAnim(NavigationStackView view, String exitAnim) {
        view.setExitAnim(exitAnim);
    }

    @Override
    public NavigationStackView createViewInstance(ThemedReactContext context) {
        return new NavigationStackView(context);
    }

    @Override
    protected void onAfterUpdateTransaction(@Nonnull NavigationStackView view) {
        view.onAfterUpdateTransaction();
    }
}
