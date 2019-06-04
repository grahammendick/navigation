package com.navigation.reactnative;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class SceneManager extends ViewGroupManager<SceneView> {

    @Override
    public String getName() {
        return "NVScene";
    }

    @ReactProp(name = "enterAnim")
    public void setEnterAnim(SceneView view, String enterAnim) {
        view.setExitAnim(enterAnim);
    }

    @ReactProp(name = "exitAnim")
    public void setExitAnim(SceneView view, String exitAnim) {
        view.setExitAnim(exitAnim);
    }

    @Override
    public SceneView createViewInstance(ThemedReactContext context) {
        return new SceneView(context);
    }

    @Override
    public int getChildCount(SceneView parent) {
        return 0;
    }

    @Override
    public void removeAllViews(SceneView parent) {
    }
}
