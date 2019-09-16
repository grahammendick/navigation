package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.ArrayList;
import java.util.HashMap;

public class NavigationStackView extends ViewGroup {
    private ArrayList<String> sceneKeys = new ArrayList<>();
    protected HashMap<String, SceneView> scenes = new HashMap<>();
    protected ReadableArray keys;
    private Activity mainActivity;
    protected String enterAnim;
    protected String exitAnim;
    protected ReadableArray sharedElementNames;
    protected ReadableArray oldSharedElementNames;
    protected boolean finish = false;
    SceneNavigator navigator;

    public NavigationStackView(Context context) {
        super(context);
    }

    @Override
    public void addView(View child, int index) {
        if (child instanceof FragmentContainerView) {
            super.addView(child, index);
            return;
        }
        SceneView scene = (SceneView) child;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
            scene.setElevation(index);
        sceneKeys.add(index - 1, scene.sceneKey);
        scenes.put(scene.sceneKey, scene);
    }

    @Override
    public void removeViewAt(int index) {
        if (index == 0) {
            super.removeViewAt(index);
            return;
        }
        String sceneKey = sceneKeys.remove(index - 1);
        scenes.remove(sceneKey);
    }

    protected void onAfterUpdateTransaction() {
        Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
        if (currentActivity == null)
            return;
        if (mainActivity == null) {
            mainActivity = currentActivity;
            Uri uri = mainActivity.getIntent().getData();
            if (uri != null) {
                mainActivity.getIntent().setData(null);
                DeviceEventManagerModule deviceEventManagerModule = ((ThemedReactContext) getContext()).getNativeModule(DeviceEventManagerModule.class);
                deviceEventManagerModule.emitNewIntentReceived(uri);
            }
        }
        if (finish) {
            currentActivity.finishAffinity();
            return;
        }
        if (scenes.size() == 0)
            return;
        int crumb = keys.size() - 1;
        int currentCrumb = navigator.oldCrumb;
        if (crumb < currentCrumb) {
            navigator.navigateBack(currentCrumb, crumb, currentActivity, this);
        }
        if (crumb > currentCrumb) {
            navigator.navigate(currentCrumb, crumb, currentActivity, this);
        }
        if (crumb == currentCrumb && !navigator.oldKey.equals(keys.getString(crumb))) {
            navigator.refresh(currentCrumb, crumb, currentActivity, this);
        }
        navigator.oldCrumb = keys.size() - 1;
        navigator.oldKey = keys.getString(navigator.oldCrumb);
    }

    @Override
    public int getChildCount() {
        return scenes.size() + 1;
    }

    @Override
    public View getChildAt(int index) {
        if (index == 0)
            return super.getChildAt(index);
        return scenes.get(sceneKeys.get(index - 1));
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        onAfterUpdateTransaction();
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}