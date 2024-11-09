package com.navigation.reactnative;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Pair;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.widget.ScrollView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.SharedElementCallback;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.R.animator;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.transition.Transition;
import androidx.viewpager2.widget.ViewPager2;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.transition.MaterialFade;

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
    protected ReadableArray oldKeys;
    private int oldCrumb = -1;
    private Activity mainActivity;
    protected String fragmentTag;
    protected ReadableArray ancestorFragmentTags;
    protected String enterAnim;
    protected String exitAnim;
    protected AnimationPropParser.Animator enterAnimator;
    protected AnimationPropParser.Animator exitAnimator;
    protected Transition enterTrans;
    protected Transition exitTrans;
    protected ReadableArray sharedElementNames;
    protected Boolean startNavigation = null;
    protected boolean containerTransform = false;
    int nativeEventCount;
    int mostRecentEventCount;

    public NavigationStackView(Context context) {
        super(context);
    }

    @SuppressLint("PrivateResource")
    protected void onAfterUpdateTransaction() {
        int eventLag = nativeEventCount - mostRecentEventCount;
        if (eventLag != 0)
            return;
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
            FragmentManager fragmentManager = ((FragmentActivity) currentActivity).getSupportFragmentManager();
            for (int i = 0; i < ancestorFragmentTags.size(); i++) {
                Fragment ancestorFragment = fragmentManager.findFragmentByTag(ancestorFragmentTags.getString(i));
                if (ancestorFragment == null) return;
                if (!(ancestorFragment instanceof DialogFragmentController dialogFragmentController))
                    fragmentManager = ancestorFragment.getChildFragmentManager();
                else
                    fragmentManager = dialogFragmentController.getSupportFragmentManager();
            }
            fragment = new StackFragment(this);
            FragmentTransaction transaction = fragmentManager.beginTransaction();
            transaction.add(fragment, fragmentTag);
            transaction.commitNowAllowingStateLoss();
            fragment.getChildFragmentManager().addOnBackStackChangedListener(new FragmentManager.OnBackStackChangedListener() {
                @Override
                public void onBackStackChanged() {
                }

                @Override
                public void onBackStackChangeStarted(@NonNull Fragment sceneFragment, boolean pop) {
                    if (pop && sceneFragment.isRemoving() && sceneFragment instanceof SceneFragment) {
                        int popCrumb = ((SceneFragment) sceneFragment).getScene().crumb;
                        int crumb = fragment.getChildFragmentManager().getBackStackEntryCount();
                        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.TIRAMISU) crumb--;
                        if (popCrumb <= crumb + 1) {
                            ReactContext reactContext = (ReactContext) getContext();
                            EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
                            eventDispatcher.dispatchEvent(new NavigationStackView.WillNavigateBackEvent(getId(), crumb));
                        }
                    }
                }
            });
        }
        startNavigation = startNavigation == null && keys.size() != 0;
        if (scenes.isEmpty() || !fragment.isAdded() || fragment.getChildFragmentManager().isStateSaved())
            return;
        int crumb = keys.size() - 1;
        int currentCrumb = oldCrumb;
        if (crumb < currentCrumb) {
            FragmentManager fragmentManager = fragment.getChildFragmentManager();
            SceneFragment fragment = (SceneFragment) fragmentManager.findFragmentByTag(oldKeys.getString(oldCrumb));
            ArrayList<Pair<SharedElementView, String>> sharedElements = fragment != null ? getOldSharedElements(currentCrumb, crumb, fragment) : null;
            SceneFragment prevFragment = (SceneFragment) fragmentManager.findFragmentByTag(keys.getString(crumb));
            if (prevFragment != null && prevFragment.getScene() != null) {
                ViewGroup parent = (ViewGroup) prevFragment.getScene().getParent();
                if (parent != null && parent != this) {
                    parent.removeView(prevFragment.getScene());
                    parent.endViewTransition(prevFragment.getScene());
                }
                if (sharedElements != null)
                    prevFragment.getScene().sharedElementMotion = new SharedElementMotion(fragment, prevFragment, getSharedElementSet(sharedElementNames), containerTransform);
            }
            String key = keys.getString(crumb);
            SceneView scene = scenes.get(key);
            assert scene != null : "Scene is null";
            String name = crumb > 0 ? String.valueOf(crumb) : null;
            if (scene.stacked) {
                fragmentManager.popBackStack(name, crumb > 0 ? 0 : FragmentManager.POP_BACK_STACK_INCLUSIVE);
            } else {
                fragmentManager.popBackStackImmediate(name, crumb > 0 ? 0 : FragmentManager.POP_BACK_STACK_INCLUSIVE);
                currentCrumb = oldCrumb = crumb;
            }
        }
        if (crumb > currentCrumb) {
            final FragmentManager fragmentManager = fragment.getChildFragmentManager();
            int enter = getAnimationResourceId(currentActivity, enterAnim, animator.fragment_open_enter);
            int exit = getAnimationResourceId(currentActivity, exitAnim, animator.fragment_open_exit);
            if (exit == 0 && exitAnim != null)
                exit = getAnimationResourceId(currentActivity, null, animator.fragment_open_exit);
            SceneFragment prevFragment = null;
            for(int i = 0; i < crumb - currentCrumb; i++) {
                int nextCrumb = currentCrumb + i + 1;
                String key = keys.getString(nextCrumb);
                SceneView scene = scenes.get(key);
                assert scene != null : "Scene is null";
                scene.stacked = true;
                int popEnter = getAnimationResourceId(currentActivity, scene.enterAnim, animator.fragment_close_enter);
                int popExit = getAnimationResourceId(currentActivity, scene.exitAnim, animator.fragment_close_exit);
                FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
                fragmentTransaction.setReorderingAllowed(true);
                ArrayList<Pair<SharedElementView, String>> sharedElements = null;
                if (nextCrumb > 0) {
                    String prevKey = keys.getString(nextCrumb - 1);
                    if (prevFragment == null)
                        prevFragment = (SceneFragment) fragmentManager.findFragmentByTag(prevKey);
                    if (prevFragment != null) {
                        sharedElements = getSharedElements(currentCrumb, crumb, prevFragment);
                        if (sharedElements != null || enterTrans != null || exitTrans != null || scene.enterTrans != null || scene.exitTrans != null) {
                            exitTrans = exitTrans != null ? exitTrans : new MaterialFade();
                            scene.enterTrans = scene.enterTrans != null ? scene.enterTrans : new MaterialFade();
                            enterTrans = enterTrans != null ? enterTrans : new MaterialFade();
                            scene.exitTrans = scene.exitTrans != null ? scene.exitTrans : new MaterialFade();
                        }
                        prevFragment.setExitTransition(exitTrans);
                        prevFragment.exitAnimator = exitAnimator;
                        prevFragment.setReenterTransition(scene.enterTrans);
                        prevFragment.reenterAnimator = scene.enterAnimator;
                    }
                }
                if (sharedElements != null) {
                    for(Pair<SharedElementView, String> sharedElement : sharedElements) {
                        SharedElementView sharedEl = sharedElement.first;
                        fragmentTransaction.addSharedElement(containerTransform ? sharedEl : sharedEl.getChildAt(0), (containerTransform ? "" : "element__") + sharedElement.second);
                    }
                }
                boolean nonAnimatedEnter = oldCrumb == -1 || ((sharedElements != null || exitTrans != null) && enterTrans == null);
                boolean nonAnimatedPopEnter = (sharedElements != null || scene.exitTrans != null) && scene.enterTrans == null;
                fragmentTransaction.setCustomAnimations(!nonAnimatedEnter ? (enterAnimator != null ? 0 : enter) : 0, exitAnimator != null ? 0 : exit, !nonAnimatedPopEnter ? (scene.enterAnimator != null ? -1 : popEnter) : 0, scene.exitAnimator != null ? -1 : popExit);
                SceneFragment fragment = new SceneFragment(scene, getSharedElementSet(sharedElementNames), containerTransform);
                fragment.setEnterTransition(enterTrans);
                fragment.enterAnimator = !nonAnimatedEnter ? enterAnimator : null;
                fragment.setReturnTransition(scene.exitTrans);
                fragment.returnAnimator = scene.exitAnimator;
                fragmentTransaction.replace(getId(), fragment, key);
                if (nextCrumb > 0) {
                    fragmentTransaction.addToBackStack(String.valueOf(nextCrumb));
                    fragmentTransaction.commit();
                } else {
                    fragmentTransaction.commitNowAllowingStateLoss();
                }
                prevFragment = fragment;
            }
        }
        if (crumb == currentCrumb) {
            int enter = getAnimationResourceId(currentActivity, enterAnim, animator.fragment_open_enter);
            int exit = getAnimationResourceId(currentActivity, exitAnim, animator.fragment_open_exit);
            String key = keys.getString(crumb);
            SceneView scene = scenes.get(key);
            assert scene != null : "Scene is null";
            if (scene.stacked) return;
            scene.stacked = true;
            int popEnter = getAnimationResourceId(currentActivity, scene.enterAnim, animator.fragment_close_enter);
            int popExit = getAnimationResourceId(currentActivity, scene.exitAnim, animator.fragment_close_exit);
            FragmentManager fragmentManager = fragment.getChildFragmentManager();
            SceneFragment prevFragment = (SceneFragment) fragmentManager.findFragmentByTag(oldKeys.getString(oldCrumb));
            if (prevFragment != null) {
                if (enterTrans != null || exitTrans != null || scene.enterTrans != null || scene.exitTrans != null) {
                    exitTrans = exitTrans != null ? exitTrans : new MaterialFade();
                    scene.enterTrans = scene.enterTrans != null ? scene.enterTrans : new MaterialFade();
                    enterTrans = enterTrans != null ? enterTrans : new MaterialFade();
                    scene.exitTrans = scene.exitTrans != null ? scene.exitTrans : new MaterialFade();
                }
                prevFragment.setExitTransition(exitTrans);
                prevFragment.exitAnimator = exitAnimator;
                prevFragment.setReenterTransition(scene.enterTrans);
                prevFragment.reenterAnimator = scene.enterAnimator;
            }
            FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
            fragmentTransaction.setReorderingAllowed(true);
            boolean nonAnimatedEnter = exitTrans != null && enterTrans == null;
            boolean nonAnimatedPopEnter = scene.exitTrans != null && scene.enterTrans == null;
            fragmentTransaction.setCustomAnimations(!nonAnimatedEnter ? (enterAnimator != null ? 0 : enter) : 0, exitAnimator != null ? 0 : exit, !nonAnimatedPopEnter ? (scene.enterAnimator != null ? -1 : popEnter) : 0, scene.exitAnimator != null ? -1 : popExit);
            SceneFragment fragment = new SceneFragment(scene, null, containerTransform);
            fragment.setEnterTransition(enterTrans);
            fragment.enterAnimator = !nonAnimatedEnter ? enterAnimator : null;
            fragment.setReturnTransition(scene.exitTrans);
            fragment.returnAnimator = scene.exitAnimator;
            fragmentTransaction.replace(getId(), fragment, key);
            if (crumb > 0) {
                fragmentManager.popBackStack();
                fragmentTransaction.addToBackStack(String.valueOf(crumb));
            }
            fragmentTransaction.commit();
        }
        oldCrumb = keys.size() - 1;
        oldKeys = keys;
    }

    int getAnimationResourceId(Context context, String animationName, int defaultId) {
        if (animationName == null)
            return defaultId;
        if (animationName.isEmpty())
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

    ArrayList<Pair<SharedElementView, String>> getSharedElements(HashMap<String, SharedElementView> sharedElementMap, ReadableArray sharedElementNames) {
        if (sharedElementMap == null || sharedElementNames == null)
            return null;
        ArrayList<Pair<SharedElementView, String>> sharedElementPairs = new ArrayList<>();
        for(int i = 0; i < sharedElementNames.size(); i++) {
            String name = sharedElementNames.getString(i);
            if (sharedElementMap.containsKey(name))
                sharedElementPairs.add(Pair.create(sharedElementMap.get(name), name));
        }
        return sharedElementPairs;
    }

    private ArrayList<Pair<SharedElementView, String>> getOldSharedElements(int currentCrumb, int crumb, SceneFragment sceneFragment) {
        final HashMap<String, SharedElementView> oldSharedElementsMap = getSharedElementMap(sceneFragment.getScene());
        final ArrayList<Pair<SharedElementView, String>> oldSharedElements = currentCrumb - crumb == 1 ? getSharedElements(oldSharedElementsMap, sharedElementNames) : null;
        if (oldSharedElements != null && !oldSharedElements.isEmpty()) {
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

    private ArrayList<Pair<SharedElementView, String>> getSharedElements(int currentCrumb, int crumb, SceneFragment sceneFragment) {
        final HashMap<String, SharedElementView> sharedElementsMap = getSharedElementMap(sceneFragment.getScene());
        final ArrayList<Pair<SharedElementView, String>> sharedElements = crumb - currentCrumb == 1 ? getSharedElements(sharedElementsMap, sharedElementNames) : null;
        if (sharedElements != null && !sharedElements.isEmpty()) {
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
        FragmentManager fragmentManager = fragment.getParentFragmentManager();
        if (fragmentManager.getPrimaryNavigationFragment() != fragment) {
            FragmentTransaction transaction = fragmentManager
                .beginTransaction()
                .setPrimaryNavigationFragment(fragment);
            try {
                transaction.commitNowAllowingStateLoss();
            } catch(IllegalStateException ignored) {
                transaction.commit();
            }
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        ((ThemedReactContext) getContext()).removeLifecycleEventListener(this);
        try {
            FragmentManager fragmentManager = fragment.getParentFragmentManager();
            if (fragmentManager.getPrimaryNavigationFragment() == fragment) {
                FragmentTransaction transaction = fragmentManager
                    .beginTransaction()
                    .setPrimaryNavigationFragment(null);
                    transaction.commitNowAllowingStateLoss();
            }
        } catch(IllegalStateException ignored) {
        }
    }

    @Override
    public WindowInsets onApplyWindowInsets(WindowInsets insets) {
        int top = insets.getSystemWindowInsetTop();
        int bottom = insets.getSystemWindowInsetBottom();
        ReactContext reactContext = (ReactContext) getContext();
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
        eventDispatcher.dispatchEvent(new NavigationStackView.ApplyInsetsEvent(getId(), top, bottom));
        return super.onApplyWindowInsets(insets);
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
        if (fragment != null) {
            try {
                fragment.getParentFragmentManager()
                    .beginTransaction()
                    .remove(fragment)
                    .commitAllowingStateLoss();
            } catch(IllegalStateException ignored) {
            }
        }
    }

    void onRest(int crumb) {
        ReactContext reactContext = (ReactContext) getContext();
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
        if (crumb < keys.size() - 1)
            nativeEventCount++;
        eventDispatcher.dispatchEvent(new NavigationStackView.RestEvent(getId(), crumb, crumb < keys.size() - 1 ? nativeEventCount : 0));
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
            return "topNavigateToTop";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), Arguments.createMap());
        }
    }

    static class WillNavigateBackEvent extends Event<NavigationStackView.WillNavigateBackEvent> {
        private final int crumb;

        public WillNavigateBackEvent(int viewId, int crumb) {
            super(viewId);
            this.crumb = crumb;
        }

        @Override
        public String getEventName() {
            return "topWillNavigateBack";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putInt("crumb", this.crumb);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }

    static class RestEvent extends Event<NavigationStackView.RestEvent> {
        private final int crumb;
        private final int eventCount;

        public RestEvent(int viewId, int crumb, int eventCount) {
            super(viewId);
            this.crumb = crumb;
            this.eventCount = eventCount;
        }

        @Override
        public String getEventName() {
            return "topRest";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putInt("crumb", this.crumb);
            event.putInt("eventCount", this.eventCount);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }

    static class ApplyInsetsEvent extends Event<NavigationStackView.ApplyInsetsEvent> {
        private final float top;
        private final float bottom;

        public ApplyInsetsEvent(int viewId, int top, int bottom) {
            super(viewId);
            this.top = PixelUtil.toDIPFromPixel(top);
            this.bottom = PixelUtil.toDIPFromPixel(bottom);
        }

        @Override
        public String getEventName() {
            return "topApplyInsets";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putDouble("top", this.top);
            event.putDouble("bottom", this.bottom);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }
}
