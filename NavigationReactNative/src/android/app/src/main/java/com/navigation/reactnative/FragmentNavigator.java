package com.navigation.reactnative;

import android.app.Activity;

import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

class FragmentNavigator extends SceneNavigator {

    @Override
    void navigateBack(int currentCrumb, int crumb, Activity activity, NavigationStackView stack) {
        FragmentManager fragmentManager = ((FragmentActivity) activity).getSupportFragmentManager();
        fragmentManager.popBackStack(String.valueOf(crumb), 0);
    }

    @Override
    void navigate(int currentCrumb, int crumb, Activity activity, NavigationStackView stack) {
        FragmentManager fragmentManager = ((FragmentActivity) activity).getSupportFragmentManager();
        int enter = getAnimationResourceId(activity, stack.enterAnim, stack.activityOpenEnterAnimationId);
        int exit = getAnimationResourceId(activity, stack.exitAnim, stack.activityOpenExitAnimationId);
        for(int i = 0; i < crumb - currentCrumb; i++) {
            int nextCrumb = currentCrumb + i + 1;
            String key = stack.keys.getString(nextCrumb);
            SceneView scene = NavigationStackView.scenes.get(key);
            int popEnter = getAnimationResourceId(activity, scene.enterAnim, stack.activityCloseExitAnimationId);
            int popExit = getAnimationResourceId(activity, scene.exitAnim, stack.activityCloseEnterAnimationId);
            FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
            fragmentTransaction.setCustomAnimations(enter, exit, popEnter, popExit);
            fragmentTransaction.replace(stack.getChildAt(0).getId(), new SceneFragment(scene), key);
            fragmentTransaction.addToBackStack(String.valueOf(nextCrumb));
            fragmentTransaction.commit();
        }
    }

    @Override
    void refresh(int currentCrumb, int crumb, Activity activity, NavigationStackView stack) {
        int enter = getAnimationResourceId(activity, stack.enterAnim, stack.activityOpenEnterAnimationId);
        int exit = getAnimationResourceId(activity, stack.exitAnim, stack.activityOpenExitAnimationId);
        String key = stack.keys.getString(crumb);
        SceneView scene = NavigationStackView.scenes.get(key);
        int popEnter = getAnimationResourceId(activity, scene.enterAnim, stack.activityCloseExitAnimationId);
        int popExit = getAnimationResourceId(activity, scene.exitAnim, stack.activityCloseEnterAnimationId);
        FragmentManager fragmentManager = ((FragmentActivity) activity).getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.setCustomAnimations(enter, exit, popEnter, popExit);
        fragmentTransaction.replace(stack.getChildAt(0).getId(), new SceneFragment(scene), key);
        fragmentTransaction.addToBackStack(String.valueOf(crumb));
        fragmentTransaction.commit();
    }
}
