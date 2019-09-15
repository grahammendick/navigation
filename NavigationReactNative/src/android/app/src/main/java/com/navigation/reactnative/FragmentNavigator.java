package com.navigation.reactnative;

import android.app.Activity;
import android.util.Pair;
import android.view.View;

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
        int enter = getAnimationResourceId(activity, stack.enterAnim, android.R.attr.activityOpenEnterAnimation);
        int exit = getAnimationResourceId(activity, stack.exitAnim, android.R.attr.activityOpenExitAnimation);
        for(int i = 0; i < crumb - currentCrumb; i++) {
            int nextCrumb = currentCrumb + i + 1;
            String key = stack.keys.getString(nextCrumb);
            SceneView scene = NavigationStackView.scenes.get(key);
            int popEnter = getAnimationResourceId(activity, scene.enterAnim, android.R.attr.activityCloseExitAnimation);
            int popExit = getAnimationResourceId(activity, scene.exitAnim, android.R.attr.activityCloseEnterAnimation);
            FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
            fragmentTransaction.setReorderingAllowed(true);
            Pair[] sharedElements = null;
            if (nextCrumb > 0) {
                String prevKey = stack.keys.getString(nextCrumb - 1);
                SceneFragment prevFramgent = (SceneFragment) fragmentManager.findFragmentByTag(prevKey);
                sharedElements = getSharedElements(currentCrumb, crumb, prevFramgent, stack);
            }
            if (sharedElements != null) {
                for(Pair<View, String> sharedElement : sharedElements) {
                    fragmentTransaction.addSharedElement(sharedElement.first, sharedElement.second);
                }
                fragmentTransaction.setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE);
            } else {
                fragmentTransaction.setCustomAnimations(oldCrumb != -1 ? enter : 0, exit, popEnter, popExit);
            }
            SceneFragment fragment = new SceneFragment(scene, getSharedElementSet(stack.sharedElementNames));
            fragmentTransaction.replace(stack.getChildAt(0).getId(), fragment, key);
            fragmentTransaction.addToBackStack(String.valueOf(nextCrumb));
            fragmentTransaction.commit();
        }
    }

    @Override
    void refresh(int currentCrumb, int crumb, Activity activity, NavigationStackView stack) {
        int enter = getAnimationResourceId(activity, stack.enterAnim, android.R.attr.activityOpenEnterAnimation);
        int exit = getAnimationResourceId(activity, stack.exitAnim, android.R.attr.activityOpenExitAnimation);
        String key = stack.keys.getString(crumb);
        SceneView scene = NavigationStackView.scenes.get(key);
        int popEnter = getAnimationResourceId(activity, scene.enterAnim, android.R.attr.activityCloseExitAnimation);
        int popExit = getAnimationResourceId(activity, scene.exitAnim, android.R.attr.activityCloseEnterAnimation);
        FragmentManager fragmentManager = ((FragmentActivity) activity).getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.setCustomAnimations(enter, exit, popEnter, popExit);
        fragmentTransaction.replace(stack.getChildAt(0).getId(), new SceneFragment(scene, null), key);
        fragmentTransaction.addToBackStack(String.valueOf(crumb));
        fragmentTransaction.commit();
    }
}
