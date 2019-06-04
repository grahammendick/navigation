package com.navigation.reactnative;

import android.app.Activity;
import android.content.Intent;
import android.content.res.TypedArray;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.uimanager.ThemedReactContext;

import java.util.ArrayList;

public class NavigationStackView extends ViewGroup {
    public static ArrayList<SceneItem> sceneItems = new ArrayList<>();
    private int oldCrumb = 0;
    private int activityOpenEnterAnimationId;
    private int activityOpenExitAnimationId;
    private int activityCloseEnterAnimationId;
    private int activityCloseExitAnimationId;

    public NavigationStackView(ThemedReactContext context) {
        super(context);

        TypedArray activityStyle = context.getTheme().obtainStyledAttributes(new int[] {android.R.attr.windowAnimationStyle});
        int windowAnimationStyleResId = activityStyle.getResourceId(0, 0);
        activityStyle.recycle();

        activityStyle = context.getTheme().obtainStyledAttributes(windowAnimationStyleResId, new int[] {
                android.R.attr.activityOpenEnterAnimation, android.R.attr.activityOpenExitAnimation,
                android.R.attr.activityCloseEnterAnimation, android.R.attr.activityCloseExitAnimation
        });
        activityOpenEnterAnimationId = activityStyle.getResourceId(0, 0);
        activityOpenExitAnimationId = activityStyle.getResourceId(1, 0);
        activityCloseEnterAnimationId = activityStyle.getResourceId(2, 0);
        activityCloseExitAnimationId = activityStyle.getResourceId(3, 0);
        activityStyle.recycle();
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    public void addView(View child, int index) {
        Intent intent = null;
        if (index == 0) {
            super.addView(child, index);
            intent = ((ThemedReactContext) getContext()).getCurrentActivity().getIntent();
        }
        sceneItems.add(index, new SceneItem(index, intent, (SceneView) child));
    }

    @Override
    public void removeViewAt(int index) {
        sceneItems.remove(index);
    }

    protected void onAfterUpdateTransaction() {
        if (sceneItems.size()  == 0)
            return;
        Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
        int crumb = sceneItems.size() - 1;
        int currentCrumb = oldCrumb;
        SceneItem sceneItem = sceneItems.get(crumb);
        if (crumb < currentCrumb) {
            Intent intent = sceneItem.intent;
            String enterAnim = sceneItem.view.getEnterAnim();
            String exitAnim = sceneItem.view.getExitAnim();
            int enter = this.getAnimationResourceId(enterAnim, this.activityOpenEnterAnimationId);
            int exit = this.getAnimationResourceId(exitAnim, this.activityOpenExitAnimationId);
            currentActivity.navigateUpTo(intent);
            currentActivity.overridePendingTransition(enter, exit);
        }
        if (crumb > currentCrumb) {
            Intent[] intents = new Intent[crumb - currentCrumb];
            for(int i = 0; i < crumb - currentCrumb; i++) {
                int nextCrumb = currentCrumb + i + 1;
                Class scene = nextCrumb % 2 == 0 ? SceneActivity.class : AlternateSceneActivity.class;
                Intent intent = new Intent(getContext(), scene);
                intent.putExtra(SceneActivity.CRUMB, nextCrumb);
                sceneItems.get(nextCrumb).intent = intent;
                intents[i] = intent;
            }
            String enterAnim = sceneItem.view.getEnterAnim();
            String exitAnim = sceneItem.view.getExitAnim();
            int enter = this.getAnimationResourceId(enterAnim, this.activityOpenEnterAnimationId);
            int exit = this.getAnimationResourceId(exitAnim, this.activityOpenExitAnimationId);
            if (crumb - currentCrumb == 1)
                currentActivity.startActivity(intents[0]);
            else
                currentActivity.startActivities(intents);
            currentActivity.overridePendingTransition(enter, exit);
        }
        oldCrumb = sceneItems.size() - 1;
    }

    private int getAnimationResourceId(String animationName, int defaultId) {
        if (animationName == null)
            return defaultId;
        String packageName = getContext().getPackageName();
        return getContext().getResources().getIdentifier(animationName, "anim", packageName);
    }

    @Override
    public int getChildCount() {
        return sceneItems.size();
    }

    @Override
    public View getChildAt(int index) {
        return sceneItems.get(index).view;
    }

    static class SceneItem {
        public int crumb;
        public Intent intent;
        public SceneView view;

        public SceneItem(int crumb, Intent intent, SceneView view){
            this.crumb = crumb;
            this.intent = intent;
            this.view = view;
        }
    }
}