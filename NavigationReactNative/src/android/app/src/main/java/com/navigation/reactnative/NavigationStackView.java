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
        Intent intent;
        Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
        if (index == 0) {
            if (sceneItems.size() > 0) {
                intent = sceneItems.get(0).intent;
                currentActivity.navigateUpTo(intent);
                sceneItems.clear();
            }
            super.addView(child, index);
            intent = currentActivity.getIntent();
        }
        else {
            Class scene = index % 2 == 1 ? SceneActivity.class : AlternateSceneActivity.class;
            intent = new Intent(getContext(), scene);
            intent.putExtra(SceneActivity.CRUMB, index);
            String enterAnim = ((SceneView) child).getEnterAnim();
            String exitAnim = ((SceneView) child).getExitAnim();
            int enter = this.getAnimationResourceId(enterAnim, this.activityOpenEnterAnimationId);
            int exit = this.getAnimationResourceId(exitAnim, this.activityOpenExitAnimationId);
            currentActivity.startActivity(intent, null);
            currentActivity.overridePendingTransition(enter, exit);
        }
        sceneItems.add(index, new SceneItem(index, intent, child));
    }

    private int getAnimationResourceId(String animationName, int defaultId) {
        if (animationName == null)
            return defaultId;
        String packageName = getContext().getPackageName();
        return getContext().getResources().getIdentifier(animationName, "anim", packageName);
    }

    @Override
    public void removeViewAt(int index) {
        SceneItem item = sceneItems.remove(index);
        if (item.crumb == index) {
            Intent intent = sceneItems.get(index - 1).intent;
            ((ThemedReactContext) getContext()).getCurrentActivity().navigateUpTo(intent);
        }
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
        public View view;

        public SceneItem(int crumb, Intent intent, View view){
            this.crumb = crumb;
            this.intent = intent;
            this.view = view;
        }
    }
}