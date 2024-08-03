package com.navigation.reactnative;

import androidx.annotation.Nullable;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

public class NavigationPackage extends TurboReactPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
            new ActionBarViewManager(),
            new BarButtonViewManager(),
            new BottomAppBarViewManager(),
            new BottomSheetViewManager(),
            new BottomSheetDialogViewManager(),
            new CollapsingBarViewManager(),
            new CoordinatorLayoutViewManager(),
            new DialogViewManager(),
            new DrawerLayoutViewManager(),
            new DrawerViewManager(),
            new ExtendedFloatingActionButtonViewManager(),
            new FloatingActionButtonViewManager(),
            new NavigationBarViewManager(),
            new NavigationStackViewManager(),
            new SceneViewManager(),
            new SearchBarViewManager(),
            new SearchResultsViewManager(),
            new SearchToolbarViewManager(),
            new SharedElementViewManager(),
            new SheetViewManager(),
            new StatusBarViewManager(),
            new TabBarViewManager(),
            new TabBarItemViewManager(),
            new TabBarPagerItemViewManager(),
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

    @Nullable
    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        if (name.equals("Material3")) {
            return new Material3Module(reactContext);
        } else {
            return null;
        }
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
            moduleInfos.put(
                "Material3",
                new ReactModuleInfo(
                    "Material3",
                    "Material3",
                    false,
                    false,
                    true,
                    false,
                    true
            ));
            return moduleInfos;
        };
    }
}
