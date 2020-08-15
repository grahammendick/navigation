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
            new NavigationStackManager(),
            new SceneManager(),
            new SharedElementManager(),
            new TabBarManager(),
            new TabBarPagerManager(),
            new TabBarItemManager(),
            new TabLayoutManager(),
            new TabNavigationManager(),
            new NavigationBarManager(),
            new ToolbarManager(),
            new TitleBarManager(),
            new SearchBarManager(),
            new CoordinatorLayoutManager(),
            new CollapsingBarManager(),
            new BarButtonManager(),
            new ActionBarManager()
        );
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return new ArrayList<>();
    }
}
