package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.content.res.TypedArray;
import android.os.Build;
import android.util.Pair;
import android.view.View;

import androidx.core.app.SharedElementCallback;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.image.ReactImageView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

abstract class SceneNavigator {
    int oldCrumb = -1;
    String oldKey;
    private HashMap<Integer, Integer> defaultAnimation;

    abstract void navigateBack(int currentCrumb, int crumb, Activity activity, NavigationStackView stack);

    abstract void navigate(int currentCrumb, int crumb, Activity activity, NavigationStackView stack);

    abstract void refresh(int currentCrumb, int crumb, Activity activity, NavigationStackView stack);

    protected int getAnimationResourceId(Context context, String animationName, int defaultId) {
        if (defaultAnimation == null) {
            defaultAnimation = new HashMap<>();
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
        if (animationName == null)
            return defaultAnimation.get(defaultId);
        String packageName = context.getPackageName();
        return context.getResources().getIdentifier(animationName, "anim", packageName);
    }

    protected Pair[] getSharedElements(int currentCrumb, int crumb, SharedElementContainer sharedElementContainer, NavigationStackView stack) {
        final HashMap<String, View> sharedElementsMap = getSharedElementMap(sharedElementContainer.getScene());
        final Pair[] sharedElements = crumb - currentCrumb == 1 ? getSharedElements(sharedElementsMap, stack.sharedElementNames) : null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && sharedElements != null && sharedElements.length != 0) {
            sharedElementContainer.setExitCallback(new SharedElementCallback() {
                @Override
                public void onSharedElementEnd(List<String> names, List<View> elements, List<View> snapshots) {
                    for (View view : elements) {
                        if (view instanceof ReactImageView)
                            ((ReactImageView) view).getDrawable().setVisible(true, true);
                    }
                }
                @Override
                public void onMapSharedElements(List<String> names, Map<String, View> elements) {
                    elements.clear();
                    for(String name : names) {
                        if (sharedElementsMap.containsKey(name))
                            elements.put(name, sharedElementsMap.get(name));
                    }
                }
            });
            return sharedElements;
        }
        return null;
    }

    protected HashSet<String> getSharedElementSet(ReadableArray sharedElementNames) {
        if (sharedElementNames == null)
            return null;
        HashSet<String> sharedElementSet = new HashSet<>();
        for(int i = 0; i < sharedElementNames.size(); i++) {
            sharedElementSet.add(sharedElementNames.getString(i));
        }
        return sharedElementSet;
    }

    private HashMap<String, View> getSharedElementMap(SceneView scene) {
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
}
