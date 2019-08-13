package com.navigation.reactnative;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class SceneManager extends ViewGroupManager<SceneView> {

    @Override
    public String getName() {
        return "NVScene";
    }

    @ReactProp(name = "sceneKey")
    public void setSceneKey(SceneView view, String sceneKey) {
        view.sceneKey = sceneKey;
    }

    @Override
    public SceneView createViewInstance(ThemedReactContext context) {
        return new SceneView(context);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onPopped", MapBuilder.of("registrationName", "onPopped"))
                .build();
    }
}
