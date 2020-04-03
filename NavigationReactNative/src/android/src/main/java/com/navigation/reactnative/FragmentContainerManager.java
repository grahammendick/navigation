package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class FragmentContainerManager extends ViewGroupManager<FragmentContainerView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVFragmentContainer";
    }

    @Nonnull
    @Override
    protected FragmentContainerView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new FragmentContainerView(reactContext);
    }
}
