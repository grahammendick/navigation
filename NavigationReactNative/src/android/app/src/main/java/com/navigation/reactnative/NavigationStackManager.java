package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class NavigationStackManager extends ViewGroupManager<NavigationStackView> {

    @Override
    public String getName() {
        return "NVNavigationStack";
    }

    @Override
    public NavigationStackView createViewInstance(ThemedReactContext context) {
        return new NavigationStackView(context);
    }
}
