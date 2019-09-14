package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;

abstract class SceneNavigator {

    abstract void navigateBack(int currentCrumb, int crumb, Activity activity, NavigationStackView stack);

    abstract void navigate(int currentCrumb, int crumb, Activity activity, NavigationStackView stack);

    abstract void refresh(int currentCrumb, int crumb, Activity activity, NavigationStackView stack);

    protected int getAnimationResourceId(Context context, String animationName, int defaultId) {
        if (animationName == null)
            return defaultId;
        String packageName = context.getPackageName();
        return context.getResources().getIdentifier(animationName, "anim", packageName);
    }
}
