package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class FragmentContainerManager extends ViewGroupManager<FragmentContainerView> {

    @Override
    public String getName() {
        return "NVFragmentContainer";
    }

    @Override
    protected FragmentContainerView createViewInstance(ThemedReactContext reactContext) {
        return new FragmentContainerView(reactContext);
    }
}
