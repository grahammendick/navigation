package com.navigation.reactnative;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class NavigationPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
            new NavigationStackManager(),
            new SceneManager(),
            new SharedElementManager(),
            new SceneBinManager()
        );
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return new ArrayList<>();
    }
}
