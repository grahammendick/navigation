package com.navigation.reactnative;

import android.app.Activity;
import android.app.ActivityOptions;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Pair;
import android.view.View;

import androidx.core.app.SharedElementCallback;

import com.facebook.react.views.image.ReactImageView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

class ActivityNavigator extends SceneNavigator {
    private static final String ORIENTATION = "Navigation.ORIENTATION";

    @Override
    void navigateBack(int currentCrumb, int crumb, Activity activity, NavigationStackView stack) {
        SceneActivity.scenes = stack.scenes;
        Intent intent = new Intent(activity, SceneActivity.class);
        String key = stack.keys.getString(crumb);
        intent.putExtra(SceneActivity.KEY, key);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int enter = getAnimationResourceId(activity, stack.enterAnim, android.R.attr.activityCloseEnterAnimation);
        int exit = getAnimationResourceId(activity, stack.exitAnim, android.R.attr.activityCloseExitAnimation);
        boolean orientationChanged = activity.getIntent().getIntExtra(ORIENTATION, 0) != activity.getResources().getConfiguration().orientation;
        Pair[] sharedElements = getOldSharedElements(currentCrumb, crumb, (SceneActivity) activity, stack, activity);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && sharedElements != null && !orientationChanged)
            activity.finishAfterTransition();
        else
            activity.navigateUpTo(intent);
        activity.overridePendingTransition(enter, exit);
    }

    @Override
    void navigate(int currentCrumb, int crumb, Activity activity, NavigationStackView stack) {
        SceneActivity.scenes = stack.scenes;
        Intent[] intents = new Intent[crumb - currentCrumb];
        for(int i = 0; i < crumb - currentCrumb; i++) {
            int nextCrumb = currentCrumb + i + 1;
            Intent intent = new Intent(activity, SceneActivity.class);
            String key = stack.keys.getString(nextCrumb);
            intent.putExtra(SceneActivity.KEY, key);
            intent.putExtra(ORIENTATION, activity.getResources().getConfiguration().orientation);
            intents[i] = intent;
        }
        int enter = getAnimationResourceId(activity, stack.enterAnim, android.R.attr.activityOpenEnterAnimation);
        int exit = getAnimationResourceId(activity, stack.exitAnim, android.R.attr.activityOpenExitAnimation);
        Pair[] sharedElements = null;
        if (activity instanceof SharedElementContainer)
            sharedElements = getSharedElements(currentCrumb, crumb, (SharedElementContainer) activity, stack);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && sharedElements != null) {
            intents[0].putExtra(SceneActivity.SHARED_ELEMENTS, getSharedElementSet(stack.sharedElementNames));
            @SuppressWarnings("unchecked")
            Bundle bundle = ActivityOptions.makeSceneTransitionAnimation(activity, sharedElements).toBundle();
            activity.startActivity(intents[0], bundle);
        } else {
            activity.startActivities(intents);
        }
        activity.overridePendingTransition(oldCrumb != -1 ? enter : 0, oldCrumb != -1 ? exit : 0);
    }

    @Override
    void refresh(int currentCrumb, int crumb, Activity activity, NavigationStackView stack) {
        SceneActivity.scenes = stack.scenes;
        Intent intent = new Intent(activity, SceneActivity.class);
        String key = stack.keys.getString(crumb);
        intent.putExtra(SceneActivity.KEY, key);
        int enter = getAnimationResourceId(activity, stack.enterAnim, android.R.attr.activityOpenEnterAnimation);
        int exit = getAnimationResourceId(activity, stack.exitAnim, android.R.attr.activityOpenExitAnimation);
        activity.finish();
        activity.startActivity(intent);
        activity.overridePendingTransition(enter, exit);
    }

    private Pair[] getOldSharedElements(int currentCrumb, int crumb, SharedElementContainer sharedElementContainer, final NavigationStackView stack, final Activity activity) {
        final HashMap<String, View> oldSharedElementsMap = getSharedElementMap(sharedElementContainer.getScene());
        final Pair[] oldSharedElements = currentCrumb - crumb == 1 ? getSharedElements(oldSharedElementsMap, stack.oldSharedElementNames) : null;
        if (oldSharedElements != null && oldSharedElements.length != 0) {
            final SharedElementTransitioner transitioner = new SharedElementTransitioner(sharedElementContainer, getSharedElementSet(stack.oldSharedElementNames));
            sharedElementContainer.setEnterCallback(new SharedElementCallback() {
                @Override
                public void onMapSharedElements(List<String> names, Map<String, View> elements) {
                    names.clear();
                    elements.clear();
                    for(int i = 0; i < stack.oldSharedElementNames.size(); i++) {
                        String name = stack.oldSharedElementNames.getString(i);
                        names.add(name);
                        if (oldSharedElementsMap.containsKey(name)) {
                            View oldSharedElement = oldSharedElementsMap.get(name);
                            elements.put(name, oldSharedElement);
                            SharedElementView oldSharedElementView = (SharedElementView) oldSharedElement.getParent();
                            transitioner.load(name, oldSharedElementView.exitTransition, activity);
                        }
                    }
                }
            });
            return oldSharedElements;
        }
        return null;
    }

    private Pair[] getSharedElements(int currentCrumb, int crumb, SharedElementContainer sharedElementContainer, NavigationStackView stack) {
        final HashMap<String, View> sharedElementsMap = getSharedElementMap(sharedElementContainer.getScene());
        final Pair[] sharedElements = crumb - currentCrumb == 1 ? getSharedElements(sharedElementsMap, stack.sharedElementNames) : null;
        if (sharedElements != null && sharedElements.length != 0) {
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
}
