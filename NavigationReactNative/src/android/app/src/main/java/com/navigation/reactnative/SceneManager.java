package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class SceneManager extends ViewGroupManager<SceneView> {

    @Override
    public String getName() {
        return "NVScene";
    }

    @Override
    public SceneView createViewInstance(ThemedReactContext context) {
        return new SceneView(context);
    }
}
