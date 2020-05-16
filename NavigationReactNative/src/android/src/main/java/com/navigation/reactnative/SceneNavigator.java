package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.content.res.TypedArray;
import android.os.Build;
import android.util.Pair;
import android.util.SparseIntArray;
import android.view.View;

import com.facebook.react.bridge.ReadableArray;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

abstract class SceneNavigator {
    int oldCrumb = -1;
    String oldKey;
    private SparseIntArray defaultAnimation;

    boolean canNavigate(Activity activity, NavigationStackView stack) {
        return true;
    }

    abstract void navigateBack(int currentCrumb, int crumb, Activity activity, NavigationStackView stack);

    abstract void navigate(int currentCrumb, int crumb, Activity activity, NavigationStackView stack);

    abstract void refresh(int currentCrumb, int crumb, Activity activity, NavigationStackView stack);

    int getAnimationResourceId(Context context, String animationName, int defaultId) {
        if (defaultAnimation == null) {
            defaultAnimation = new SparseIntArray();
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

    HashMap<String, View> getSharedElementMap(SceneView scene) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP)
            return null;
        HashMap<String, View> sharedElementMap = new HashMap<>();
        for(View sharedElement : scene.sharedElements) {
            sharedElementMap.put(sharedElement.getTransitionName(), sharedElement);
        }
        return sharedElementMap;
    }

    Pair[] getSharedElements(HashMap<String, View> sharedElementMap, ReadableArray sharedElementNames) {
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
