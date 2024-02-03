package com.navigation.reactnative;

import android.view.View;
import android.view.animation.Animation;
import android.view.animation.TranslateAnimation;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.material.transition.Hold;
import com.google.android.material.transition.MaterialElevationScale;
import com.google.android.material.transition.MaterialFade;
import com.google.android.material.transition.MaterialFadeThrough;
import com.google.android.material.transition.MaterialSharedAxis;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;

public class NavigationStackManager extends ViewGroupManager<NavigationStackView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVNavigationStack";
    }

    @ReactProp(name = "keys")
    public void setKeys(NavigationStackView view, ReadableArray keys) {
        view.keys = keys;
    }

    @ReactProp(name = "enterAnim")
    public void setEnterAnim(NavigationStackView view, String enterAnim) {
        view.enterAnim = enterAnim;
    }

    @ReactProp(name = "exitAnim")
    public void setExitAnim(NavigationStackView view, String exitAnim) {
        view.exitAnim = exitAnim;
    }

    @ReactProp(name = "enterTrans")
    public void setEnterTrans(NavigationStackView view, ReadableMap enterTrans) {
        view.enterAnimation = null;
        view.enterTrans = null;
        if (enterTrans != null) {
            switch (enterTrans.getString("type")) {
                case "sharedAxis" :
                    Map<String, Integer> axisMap = new HashMap<>();
                    axisMap.put("x", MaterialSharedAxis.X);
                    axisMap.put("y", MaterialSharedAxis.Y);
                    Integer axis = axisMap.get(enterTrans.getString("axis"));
                    view.enterTrans = new MaterialSharedAxis(axis != null ? axis : MaterialSharedAxis.Z, true);
                    break;
                case "elevationScale" :
                    view.enterTrans = new MaterialElevationScale(true);
                    break;
                case "fade" :
                    view.enterTrans = new MaterialFade();
                    break;
                case "fadeThrough" :
                    view.enterTrans = new MaterialFadeThrough();
                    break;
                case "hold" :
                    view.enterTrans = new Hold();
                    break;
                case "translate" :
                    String fromX = enterTrans.getString("fromX");
                    float fromXValue = 0f;
                    int fromXType = Animation.ABSOLUTE;
                    if (fromX != null) {
                        if (fromX.endsWith("%")) {
                            fromXType = Animation.RELATIVE_TO_SELF;
                            fromXValue = Float.parseFloat(fromX.substring(0, fromX.length() - 1)) / 100;
                        } else {
                            fromXValue = Float.parseFloat(fromX);
                        }
                    }
                    String fromY = enterTrans.getString("fromY");
                    float fromYValue = 0f;
                    int fromYType = Animation.ABSOLUTE;
                    if (fromY != null) {
                        if (fromY.endsWith("%")) {
                            fromYType = Animation.RELATIVE_TO_SELF;
                            fromYValue = Float.parseFloat(fromY.substring(0, fromY.length() - 1)) / 100;
                        } else {
                            fromYValue = Float.parseFloat(fromY);
                        }
                    }
                    view.enterAnimation = new TranslateAnimation(fromXType, fromXValue, Animation.RELATIVE_TO_SELF, 0, fromYType, fromYValue, Animation.RELATIVE_TO_SELF, 0);
                    view.enterAnimation.setDuration(enterTrans.hasKey("duration") ? enterTrans.getInt("duration") : 300);
                    break;
            }
        }
    }

    @ReactProp(name = "exitTrans")
    public void setExitTrans(NavigationStackView view, ReadableMap exitTrans) {
        if (exitTrans != null) {
            switch (exitTrans.getString("type")) {
                case "sharedAxis" :
                    Map<String, Integer> axisMap = new HashMap();
                    axisMap.put("x", MaterialSharedAxis.X);
                    axisMap.put("y", MaterialSharedAxis.Y);
                    Integer axis = axisMap.get(exitTrans.getString("axis"));
                    view.exitTrans = new MaterialSharedAxis(axis != null ? axis : MaterialSharedAxis.Z, true);
                    break;
                case "elevationScale" :
                    view.exitTrans = new MaterialElevationScale(false);
                    break;
                case "fade" :
                    view.exitTrans = new MaterialFade();
                    break;
                case "fadeThrough" :
                    view.exitTrans = new MaterialFadeThrough();
                    break;
                case "hold" :
                    view.exitTrans = new Hold();
                    break;
            }
        } else {
            view.exitTrans = null;
        }
    }

    @ReactProp(name = "sharedElements")
    public void setSharedElements(NavigationStackView view, ReadableArray sharedElements) {
        view.sharedElementNames = sharedElements;
    }

    @ReactProp(name = "containerTransform")
    public void setContainerTransform(NavigationStackView view, boolean containerTransform) {
        view.containerTransform = containerTransform;
    }

    @Nonnull
    @Override
    protected NavigationStackView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new NavigationStackView(reactContext);
    }

    @Override
    public void addView(NavigationStackView parent, View child, int index) {
        SceneView scene = (SceneView) child;
        if (index > 0)
            scene.setElevation(getChildAt(parent, index - 1).getElevation() + 1);
        parent.sceneKeys.add(index, scene.sceneKey);
        parent.scenes.put(scene.sceneKey, scene);
        if (parent.startNavigation != null && parent.startNavigation && parent.keys.size() == parent.scenes.size())
            parent.onAfterUpdateTransaction();
    }

    @Override
    public void removeViewAt(NavigationStackView parent, int index) {
        String sceneKey = parent.sceneKeys.remove(index);
        parent.scenes.remove(sceneKey);
    }

    @Override
    public int getChildCount(NavigationStackView parent) {
        return parent.scenes.size();
    }

    @Override
    public View getChildAt(NavigationStackView parent, int index) {
        return parent.scenes.get(parent.sceneKeys.get(index));
    }

    @Override
    protected void onAfterUpdateTransaction(@Nonnull NavigationStackView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }

    @Override
    public void onDropViewInstance(@NonNull NavigationStackView view) {
        view.removeFragment();
        super.onDropViewInstance(view);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topNavigateToTop", MapBuilder.of("registrationName", "onNavigateToTop"))
            .put("topRest", MapBuilder.of("registrationName", "onRest"))
            .build();
    }
}
