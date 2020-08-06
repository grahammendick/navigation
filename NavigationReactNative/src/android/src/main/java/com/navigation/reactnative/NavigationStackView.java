package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ScrollView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.HashMap;

public class NavigationStackView extends ViewGroup implements LifecycleEventListener {
    protected ArrayList<String> sceneKeys = new ArrayList<>();
    protected HashMap<String, SceneView> scenes = new HashMap<>();
    Fragment fragment = null;
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
        if (fragment == null) {
            fragment = new StackFragment(this);
            FragmentManager fragmentManager = ((FragmentActivity) currentActivity).getSupportFragmentManager();
            FragmentTransaction transaction = fragmentManager.beginTransaction();
            transaction.add(fragment, "Stack" + getId());
            transaction.commitNowAllowingStateLoss();
        }
        if (scenes.size() == 0 || !navigator.canNavigate(currentActivity, this))
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
        ((ThemedReactContext) getContext()).addLifecycleEventListener(this);
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        ((ThemedReactContext) getContext()).removeLifecycleEventListener(this);
    }

    void scrollToTop() {
        if (keys.size() > 1) {
            ReactContext reactContext = (ReactContext) getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "onNavigateToTop", null);
        }
        if (keys.size() == 1) {
            SceneView scene = scenes.get(keys.getString(0));
            for (int i = 0; i < scene.getChildCount(); i++) {
                if (scene.getChildAt(i) instanceof CoordinatorLayoutView)
                    ((CoordinatorLayoutView) scene.getChildAt(i)).scrollToTop();
                if (scene.getChildAt(i) instanceof NavigationBarView)
                    ((NavigationBarView) scene.getChildAt(i)).setExpanded(true);
                if (scene.getChildAt(i) instanceof ScrollView)
                    ((ScrollView) scene.getChildAt(i)).smoothScrollTo(0, 0);
                if (scene.getChildAt(i) instanceof TabBarPagerView)
                    ((TabBarPagerView) scene.getChildAt(i)).scrollToTop();
            }
        }
    }

    void removeFragment() {
        if (mainActivity != null && fragment != null) {
            FragmentManager fragmentManager = ((FragmentActivity) mainActivity).getSupportFragmentManager();
            FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
            fragmentTransaction.remove(fragment);
            fragmentTransaction.commitAllowingStateLoss();
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    public void onHostResume() {
        onAfterUpdateTransaction();
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
    }

    public static class StackFragment extends Fragment {
        private NavigationStackView stack;

        public StackFragment() {
            super();
        }

        StackFragment(NavigationStackView stack) {
            super();
            this.stack = stack;
        }

        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            return stack != null ? stack : new View(getContext());
        }
    }
}
