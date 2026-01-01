package com.navigation.reactnative;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

public class SceneManager extends ViewGroupManager<SceneView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVScene";
    }

    @ReactProp(name = "crumb")
    public void setCrumb(SceneView view, int crumb) {
        view.crumb = crumb;
    }

    @ReactProp(name = "sceneKey")
    public void setSceneKey(SceneView view, String sceneKey) {
        view.sceneKey = sceneKey;
    }

    @ReactProp(name = "enterAnim")
    public void setEnterAnim(SceneView view, String enterAnim) {
        view.enterAnim = enterAnim;
    }

    @ReactProp(name = "exitAnim")
    public void setExitAnim(SceneView view, String exitAnim) {
        view.exitAnim = exitAnim;
    }

    @ReactProp(name = "enterTrans")
    public void setEnterTrans(SceneView view, ReadableMap enterTrans) {
        view.enterTrans = enterTrans;
        view.enterAnimator = AnimationPropParser.getAnimator(enterTrans, true);
    }

    @ReactProp(name = "exitTrans")
    public void setExitTrans(SceneView view, ReadableMap exitTrans) {
        view.exitTrans = exitTrans;
        view.exitAnimator = AnimationPropParser.getAnimator(exitTrans, false);
    }

    @ReactProp(name = "landscape")
    public void setLandscape(SceneView view, boolean landscape) {
        view.setLandscape(landscape);
    }

    @Override
    protected void finalize() throws Throwable {
        super.finalize();
    }

    @Nonnull
    @Override
    protected SceneView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new SceneView(reactContext);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topPopped", MapBuilder.of("registrationName", "onPopped"))
            .build();
    }
}
