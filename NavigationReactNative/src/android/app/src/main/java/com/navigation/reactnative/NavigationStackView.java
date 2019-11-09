package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.net.Uri;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.ArrayList;
import java.util.HashMap;

public class NavigationStackView extends ViewGroup {
    protected ArrayList<String> sceneKeys = new ArrayList<>();
    protected HashMap<String, SceneView> scenes = new HashMap<>();
    protected ReadableArray keys;
    private Activity mainActivity;
    protected String enterAnim;
    protected String exitAnim;
    protected ReadableArray sharedElementNames;
    protected ReadableArray oldSharedElementNames;
    protected boolean primary = true;
    protected boolean finish = false;
    SceneNavigator navigator;

    public NavigationStackView(Context context) {
        super(context);
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
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        onAfterUpdateTransaction();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        if (primary) {
            FragmentManager fragmentManager = ((FragmentActivity) mainActivity).getSupportFragmentManager();
            FragmentTransaction fragmentTransation = fragmentManager.beginTransaction();
            for (Fragment fragment : fragmentManager.getFragments()) {
                fragmentTransation.remove(fragment);
            }
            fragmentTransation.commitAllowingStateLoss();
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}