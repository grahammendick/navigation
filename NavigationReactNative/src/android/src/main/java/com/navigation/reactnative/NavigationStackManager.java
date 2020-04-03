package com.navigation.reactnative;

import android.os.Build;
import android.view.View;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nonnull;

public class NavigationStackManager extends ViewGroupManager<NavigationStackView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVNavigationStack";
    }

    @ReactProp(name = "keys")
    public void setkeys(NavigationStackView view, ReadableArray keys) {
        view.keys = keys;
    }

    @ReactProp(name = "fragmentMode")
    public void setFragmentMode(NavigationStackView view, Boolean fragmentMode) {
        view.navigator = !fragmentMode ? new ActivityNavigator() : new FragmentNavigator();
    }

    @ReactProp(name = "enterAnim")
    public void setEnterAnim(NavigationStackView view, String enterAnim) {
        view.enterAnim = enterAnim;
    }

    @ReactProp(name = "exitAnim")
    public void setExitAnim(NavigationStackView view, String exitAnim) {
        view.exitAnim = exitAnim;
    }

    @ReactProp(name = "sharedElements")
    public void setSharedElements(NavigationStackView view, ReadableArray sharedElements) {
        view.sharedElementNames = sharedElements;
    }

    @ReactProp(name = "oldSharedElements")
    public void setOldSharedElements(NavigationStackView view, ReadableArray oldSharedElements) {
        view.oldSharedElementNames = oldSharedElements;
    }

    @ReactProp(name = "primary")
    public void setPrimary(NavigationStackView view, boolean primary) {
        view.primary = primary;
    }

    @ReactProp(name = "finish")
    public void setFinish(NavigationStackView view, boolean finish) {
        view.finish = finish;
    }

    @Nonnull
    @Override
    protected NavigationStackView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new NavigationStackView(reactContext);
    }

    @Override
    public void addView(NavigationStackView parent, View child, int index) {
        if (child instanceof FragmentContainerView) {
            parent.addView(child, index);
            return;
        }
        SceneView scene = (SceneView) child;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
            scene.setElevation(getChildAt(parent, index - 1).getElevation() + 1);
        parent.sceneKeys.add(index - 1, scene.sceneKey);
        parent.scenes.put(scene.sceneKey, scene);
    }

    @Override
    public void removeViewAt(NavigationStackView parent, int index) {
        if (index == 0) {
            parent.removeViewAt(index);
            return;
        }
        String sceneKey = parent.sceneKeys.remove(index - 1);
        parent.scenes.remove(sceneKey);
    }

    @Override
    public int getChildCount(NavigationStackView parent) {
        return parent.scenes.size() + 1;
    }

    @Override
    public View getChildAt(NavigationStackView parent, int index) {
        if (index == 0)
            return parent.getChildAt(index);
        return parent.scenes.get(parent.sceneKeys.get(index - 1));
    }

    @Override
    protected void onAfterUpdateTransaction(@Nonnull NavigationStackView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }
}
