package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class SceneBinManager extends ViewGroupManager<SceneBinView> {

    @Override
    public String getName() {
        return "SceneBin";
    }

    @Override
    public SceneBinView createViewInstance(ThemedReactContext context) {
        return new SceneBinView(context);
    }

    @Override
    public void removeAllViews(SceneBinView parent) {
    }
}
