package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.content.res.TypedArray;
import android.net.Uri;
import android.os.Bundle;
import android.util.Pair;
import android.util.SparseIntArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ScrollView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.SharedElementCallback;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.viewpager2.widget.ViewPager2;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

public class NavigationStackView extends ViewGroup implements LifecycleEventListener {
    protected final ArrayList<String> sceneKeys = new ArrayList<>();
    protected final HashMap<String, SceneView> scenes = new HashMap<>();
    Fragment fragment = null;
    protected ReadableArray keys;
    private int oldCrumb = -1;
    private String oldKey;
    private final SparseIntArray defaultAnimation = new SparseIntArray();
    private Activity mainActivity;
    protected String enterAnim;
    protected String exitAnim;
    protected ReadableArray sharedElementNames;
    protected Boolean startNavigation = null;
    protected boolean containerTransform = false;

    public NavigationStackView(Context context) {
        super(context);
        TypedArray activityStyle = context.getTheme().obtainStyledAttributes(new int[] {android.R.attr.windowAnimationStyle});
        int windowAnimationStyleResId = activityStyle.getResourceId(0, 0);
        activityStyle.recycle();

        activityStyle = context.getTheme().obtainStyledAttributes(windowAnimationStyleResId, new int[] {
            android.R.attr.activityOpenEnterAnimation, android.R.attr.activityOpenExitAnimation,
            android.R.attr.activityCloseEnterAnimation, android.R.attr.activityCloseExitAnimation
        });
        defaultAnimation.put(android.R.attr.activityOpenEnterAnimation, activityStyle.getResourceId(0, 0));
        defaultAnimation.put(android.R.attr.activityOpenExitAnimation, activityStyle.getResourceId(1, 0));
        defaultAnimation.put(android.R.attr.activityCloseEnterAnimation, activityStyle.getResourceId(2, 0));
        defaultAnimation.put(android.R.attr.activityCloseExitAnimation, activityStyle.getResourceId(3, 0));
        activityStyle.recycle();
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
                assert deviceEventManagerModule != null;
                deviceEventManagerModule.emitNewIntentReceived(uri);
            }
        }
        if (fragment == null) {
            fragment = new StackFragment(this);
            FragmentManager fragmentManager = ((FragmentActivity) currentActivity).getSupportFragmentManager();
            FragmentTransaction transaction = fragmentManager.beginTransaction();
            transaction.add(fragment, "Stack" + getId());
            transaction.commitNowAllowingStateLoss();
        }
        startNavigation = startNavigation == null && keys.size() != 0;
        if (scenes.size() == 0 || !fragment.isAdded() || fragment.getChildFragmentManager().isStateSaved())
            return;
        int crumb = keys.size() - 1;
        int currentCrumb = oldCrumb;
        if (crumb < currentCrumb) {
            FragmentManager fragmentManager = fragment.getChildFragmentManager();
            SceneFragment fragment = (SceneFragment) fragmentManager.findFragmentByTag(oldKey);
            Pair[] sharedElements = fragment != null ? getOldSharedElements(currentCrumb, crumb, fragment) : null;
            SceneFragment prevFragment = (SceneFragment) fragmentManager.findFragmentByTag(keys.getString(crumb));
            if (sharedElements != null && prevFragment != null && prevFragment.getScene() != null)
                prevFragment.getScene().sharedElementMotion = new SharedElementMotion(fragment, prevFragment, getSharedElementSet(sharedElementNames), containerTransform);
            fragmentManager.popBackStack(String.valueOf(crumb), 0);
        }
        if (crumb > currentCrumb) {
            final FragmentManager fragmentManager = fragment.getChildFragmentManager();
            int enter = getAnimationResourceId(currentActivity, enterAnim, android.R.attr.activityOpenEnterAnimation);
            int exit = getAnimationResourceId(currentActivity, exitAnim, android.R.attr.activityOpenExitAnimation);
            if (exit == 0 && exitAnim != null)
                exit = getAnimationResourceId(currentActivity, null, android.R.attr.activityOpenExitAnimation);
            for(int i = 0; i < crumb - currentCrumb; i++) {
                int nextCrumb = currentCrumb + i + 1;
                String key = keys.getString(nextCrumb);
                SceneView scene = scenes.get(key);
                assert scene != null : "Scene is null";
                int popEnter = getAnimationResourceId(currentActivity, scene.enterAnim, android.R.attr.activityCloseEnterAnimation);
                int popExit = getAnimationResourceId(currentActivity, scene.exitAnim, android.R.attr.activityCloseExitAnimation);
                FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
                fragmentTransaction.setReorderingAllowed(true);
                Pair[] sharedElements = null;
                if (nextCrumb > 0) {
                    String prevKey = keys.getString(nextCrumb - 1);
                    SceneFragment prevFragment = (SceneFragment) fragmentManager.findFragmentByTag(prevKey);
                    if (prevFragment != null)
                        sharedElements = getSharedElements(currentCrumb, crumb, prevFragment);
                }
                if (sharedElements != null) {
                    for(Pair sharedElement : sharedElements) {
                        SharedElementView sharedEl = (SharedElementView) sharedElement.first;
                        fragmentTransaction.addSharedElement(containerTransform ? sharedEl : sharedEl.getChildAt(0), (containerTransform ? "" : "element__") + sharedElement.second);
                    }
                }
                fragmentTransaction.setCustomAnimations(oldCrumb != -1 && sharedElements == null ? enter : 0, exit, sharedElements == null ? popEnter : 0, popExit);
                SceneFragment fragment = new SceneFragment(scene, getSharedElementSet(sharedElementNames), containerTransform);
                fragmentTransaction.replace(getId(), fragment, key);
                fragmentTransaction.addToBackStack(String.valueOf(nextCrumb));
                fragmentTransaction.commit();
            }
        }
        if (crumb == currentCrumb && !oldKey.equals(keys.getString(crumb))) {
            int enter = getAnimationResourceId(currentActivity, enterAnim, android.R.attr.activityOpenEnterAnimation);
            int exit = getAnimationResourceId(currentActivity, exitAnim, android.R.attr.activityOpenExitAnimation);
            String key = keys.getString(crumb);
            SceneView scene = scenes.get(key);
            assert scene != null : "Scene is null";
            int popEnter = getAnimationResourceId(currentActivity, scene.enterAnim, android.R.attr.activityCloseEnterAnimation);
            int popExit = getAnimationResourceId(currentActivity, scene.exitAnim, android.R.attr.activityCloseExitAnimation);
            FragmentManager fragmentManager = fragment.getChildFragmentManager();
            FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
            fragmentTransaction.setReorderingAllowed(true);
            fragmentTransaction.setCustomAnimations(enter, exit, popEnter, popExit);
            fragmentTransaction.replace(getId(), new SceneFragment(scene, null, containerTransform), key);
            fragmentTransaction.addToBackStack(String.valueOf(crumb));
            fragmentTransaction.commit();
        }
        oldCrumb = keys.size() - 1;
        oldKey = keys.getString(oldCrumb);
    }

    int getAnimationResourceId(Context context, String animationName, int defaultId) {
        if (animationName == null)
            return defaultAnimation.get(defaultId);
        if (animationName.equals(""))
            return 0;
        String packageName = context.getPackageName();
        return context.getResources().getIdentifier(animationName, "anim", packageName);
    }

    HashSet<String> getSharedElementSet(ReadableArray sharedElementNames) {
        if (sharedElementNames == null)
            return null;
        HashSet<String> sharedElementSet = new HashSet<>();
        for(int i = 0; i < sharedElementNames.size(); i++) {
            sharedElementSet.add(sharedElementNames.getString(i));
        }
        return sharedElementSet;
    }

    HashMap<String, SharedElementView> getSharedElementMap(SceneView scene) {
        HashMap<String, SharedElementView> sharedElementMap = new HashMap<>();
        for(SharedElementView sharedElement : scene.sharedElements) {
            sharedElementMap.put(sharedElement.getTransitionName(), sharedElement);
        }
        return sharedElementMap;
    }

    Pair[] getSharedElements(HashMap<String, SharedElementView> sharedElementMap, ReadableArray sharedElementNames) {
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

    private Pair[] getOldSharedElements(int currentCrumb, int crumb, SceneFragment sceneFragment) {
        final HashMap<String, SharedElementView> oldSharedElementsMap = getSharedElementMap(sceneFragment.getScene());
        final Pair[] oldSharedElements = currentCrumb - crumb == 1 ? getSharedElements(oldSharedElementsMap, sharedElementNames) : null;
        if (oldSharedElements != null && oldSharedElements.length != 0) {
            sceneFragment.setEnterSharedElementCallback(new SharedElementCallback() {
                @Override
                public void onMapSharedElements(List<String> names, Map<String, View> elements) {
                    for(int i = 0; i < sharedElementNames.size(); i++) {
                        String name = sharedElementNames.getString(i);
                        if (oldSharedElementsMap.containsKey(name)) {
                            SharedElementView oldSharedElement = oldSharedElementsMap.get(name);
                            elements.put(names.get(i), containerTransform ? oldSharedElement : oldSharedElement.getChildAt(0));
                        }
                    }
                }
            });
            return oldSharedElements;
        }
        return null;
    }

    private Pair[] getSharedElements(int currentCrumb, int crumb, SceneFragment sceneFragment) {
        final HashMap<String, SharedElementView> sharedElementsMap = getSharedElementMap(sceneFragment.getScene());
        final Pair[] sharedElements = crumb - currentCrumb == 1 ? getSharedElements(sharedElementsMap, sharedElementNames) : null;
        if (sharedElements != null && sharedElements.length != 0) {
            sceneFragment.setExitSharedElementCallback(new SharedElementCallback() {
                @Override
                public void onMapSharedElements(List<String> names, Map<String, View> elements) {
                    for(int i = 0; i < names.size(); i++) {
                        String mappedName = names.get(i);
                        if (sharedElementNames != null && sharedElementNames.size() > i)
                            mappedName = sharedElementNames.getString(i);
                        if (sharedElementsMap.containsKey(mappedName)) {
                            SharedElementView sharedElement = sharedElementsMap.get(mappedName);
                            elements.put(names.get(i), containerTransform ? sharedElement : sharedElement.getChildAt(0));
                        }
                    }
                }
            });
            return sharedElements;
        }
        return null;
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
            EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
            eventDispatcher.dispatchEvent(new NavigationStackView.NavigateToTopEvent(getId()));
        }
        if (keys.size() == 1) {
            SceneView scene = scenes.get(keys.getString(0));
            assert scene != null : "Scene is null";
            for (int i = 0; i < scene.getChildCount(); i++) {
                if (scene.getChildAt(i) instanceof CoordinatorLayoutView)
                    ((CoordinatorLayoutView) scene.getChildAt(i)).scrollToTop();
                if (scene.getChildAt(i) instanceof NavigationBarView)
                    ((NavigationBarView) scene.getChildAt(i)).setExpanded(true);
                if (scene.getChildAt(i) instanceof ScrollView)
                    ((ScrollView) scene.getChildAt(i)).smoothScrollTo(0, 0);
                if (scene.getChildAt(i) instanceof TabBarPagerView)
                    ((TabBarPagerView) scene.getChildAt(i)).scrollToTop();
                if (scene.getChildAt(i) instanceof ViewPager2)
                    TabBarPagerRTLManager.getAdapter((ViewPager2) scene.getChildAt(i)).scrollToTop();
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

    void onRest(int crumb) {
        ReactContext reactContext = (ReactContext) getContext();
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
        eventDispatcher.dispatchEvent(new NavigationStackView.RestEvent(getId(), crumb));
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

    static class NavigateToTopEvent extends Event<NavigationStackView.NavigateToTopEvent> {
        public NavigateToTopEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topOnNavigateToTop";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), Arguments.createMap());
        }
    }

    static class RestEvent extends Event<NavigationStackView.RestEvent> {
        private final int crumb;

        public RestEvent(int viewId, int crumb) {
            super(viewId);
            this.crumb = crumb;
        }

        @Override
        public String getEventName() {
            return "topOnRest";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putInt("crumb", this.crumb);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }
}
