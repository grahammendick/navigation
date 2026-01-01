package com.navigation.reactnative;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVSceneManagerDelegate;
import com.facebook.react.viewmanagers.NVSceneManagerInterface;

import java.util.Map;

import javax.annotation.Nonnull;

@ReactModule(name = "NVScene")
public class SceneViewManager extends ViewGroupManager<SceneView> implements NVSceneManagerInterface<SceneView> {
    private final ViewManagerDelegate<SceneView> delegate;

    public SceneViewManager() {
        delegate = new NVSceneManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<SceneView> getDelegate() {
        return delegate;
    }

    @Nonnull
    @Override
    public String getName() {
        return "NVScene";
    }

    @ReactProp(name = "crumb")
    public void setCrumb(SceneView view, int crumb) {
        view.crumb = crumb;
    }

    @Override
    public void setTitle(SceneView view, @Nullable String value) {
    }

    @Override
    public void setHidesTabBar(SceneView view, boolean value) {
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
