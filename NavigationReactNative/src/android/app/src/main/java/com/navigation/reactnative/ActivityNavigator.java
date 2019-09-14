package com.navigation.reactnative;

import android.app.Activity;
import android.content.Intent;

class ActivityNavigator extends SceneNavigator {

    @Override
    void navigateBack(int currentCrumb, int crumb, Activity activity, NavigationStackView stack) {
        Intent intent = new Intent(activity, SceneActivity.class);
        String key = stack.keys.getString(crumb);
        intent.putExtra(SceneActivity.KEY, key);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int enter = getAnimationResourceId(activity, stack.enterAnim, android.R.attr.activityCloseEnterAnimation);
        int exit = getAnimationResourceId(activity, stack.exitAnim, android.R.attr.activityCloseExitAnimation);
        activity.navigateUpTo(intent);
        activity.overridePendingTransition(enter, exit);
    }

    @Override
    void navigate(int currentCrumb, int crumb, Activity activity, NavigationStackView stack) {
        Intent[] intents = new Intent[crumb - currentCrumb];
        for(int i = 0; i < crumb - currentCrumb; i++) {
            int nextCrumb = currentCrumb + i + 1;
            Intent intent = new Intent(activity, SceneActivity.class);
            String key = stack.keys.getString(nextCrumb);
            intent.putExtra(SceneActivity.KEY, key);
            intents[i] = intent;
        }
        int enter = getAnimationResourceId(activity, stack.enterAnim, android.R.attr.activityOpenEnterAnimation);
        int exit = getAnimationResourceId(activity, stack.exitAnim, android.R.attr.activityOpenExitAnimation);
        activity.startActivities(intents);
        activity.overridePendingTransition(oldCrumb != -1 ? enter : 0, oldCrumb != -1 ? exit : 0);
    }

    @Override
    void refresh(int currentCrumb, int crumb, Activity activity, NavigationStackView stack) {
        Intent intent = new Intent(activity, SceneActivity.class);
        String key = stack.keys.getString(crumb);
        intent.putExtra(SceneActivity.KEY, key);
        int enter = getAnimationResourceId(activity, stack.enterAnim, android.R.attr.activityOpenEnterAnimation);
        int exit = getAnimationResourceId(activity, stack.exitAnim, android.R.attr.activityOpenExitAnimation);
        activity.finish();
        activity.startActivity(intent);
        activity.overridePendingTransition(enter, exit);
    }
}
