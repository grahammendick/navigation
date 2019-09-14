package com.navigation.reactnative;

import android.app.Activity;
import android.app.ActivityOptions;
import android.app.SharedElementCallback;
import android.content.Context;
import android.content.Intent;
import android.content.res.TypedArray;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Pair;
import android.view.View;
import android.view.ViewGroup;

import androidx.core.view.ViewCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.image.ReactImageView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

public class NavigationStackView extends ViewGroup {
    private static final String ORIENTATION = "Navigation.ORIENTATION";
    private ArrayList<String> sceneKeys = new ArrayList<>();
    public static HashMap<String, SceneView> scenes = new HashMap<>();
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
        ViewCompat.setElevation(scene, index);
        sceneKeys.add(index - 1, scene.sceneKey);
        scenes.put(scene.sceneKey, scene);
    }

    @Override
    public void removeViewAt(int index) {
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
            mainActivity.finish();
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
    public void onDetachedFromWindow() {
        /*Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
        if (keys.size() > 0 && currentActivity != null) {
            Intent mainIntent = mainActivity.getIntent();
            mainIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            currentActivity.navigateUpTo(mainIntent);
        }*/
        scenes.clear();
        super.onDetachedFromWindow();
    }

    private HashSet<String> getSharedElementSet(ReadableArray sharedElementNames) {
        HashSet<String> sharedElementSet = new HashSet<>();
        for(int i = 0; i < sharedElementNames.size(); i++) {
            sharedElementSet.add(sharedElementNames.getString(i));
        }
        return sharedElementSet;
    }

    private HashMap<String, View> getSharedElementMap() {
        Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
        if (!(currentActivity instanceof SceneActivity))
            return null;
        SceneView scene = ((SceneActivity) currentActivity).scene;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP)
            return null;
        HashMap<String, View> sharedElementMap = new HashMap<>();
        for(View sharedElement : scene.sharedElements) {
            sharedElementMap.put(sharedElement.getTransitionName(), sharedElement);
        }
        return sharedElementMap;
    }

    private Pair[] getSharedElements(HashMap<String, View> sharedElementMap, ReadableArray sharedElementNames) {
        if (sharedElementMap == null || sharedElementNames == null)
            return null;
        ArrayList<Pair> sharedElementPairs = new ArrayList<>();
        for(int i = 0; i < sharedElementNames.size(); i++) {
            String name = sharedElementNames.getString(i);
            if (sharedElementMap.containsKey(name))
                sharedElementPairs.add(Pair.create(sharedElementMap.get(name), name));
        }
        return sharedElementPairs.toArray(new Pair[0]);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}