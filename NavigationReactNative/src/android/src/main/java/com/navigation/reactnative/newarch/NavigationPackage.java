package com.navigation.reactnative;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class NavigationPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
            new ActionBarViewManager(),
            new BarButtonViewManager(),
            new BottomSheetViewManager(),
            new CollapsingBarViewManager(),
            new CoordinatorLayoutViewManager(),
            new ExtendedFloatingActionButtonViewManager(),
            new FloatingActionButtonViewManager(),
            new NavigationBarViewManager(),
            new NavigationStackViewManager(),
            new SearchBarViewManager(),
            new SceneViewManager(),
            new SharedElementViewManager(),
            new StatusBarViewManager(),
            new TabBarViewManager(),
            new TabBarItemViewManager(),
            new TabBarPagerViewManager(),
            new TabBarPagerRTLViewManager(),
            new TabLayoutViewManager(),
            new TabLayoutRTLViewManager(),
            new TabNavigationViewManager(),
            new TitleBarViewManager(),
            new ToolbarViewManager()
        );
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return new ArrayList<>();
    }
}
