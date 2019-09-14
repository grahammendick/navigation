package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.content.res.TypedArray;

import java.util.HashMap;

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
}
