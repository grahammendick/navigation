package com.navigation.reactnative;

import android.app.Activity;
import android.app.ActivityOptions;
import android.app.SharedElementCallback;
import android.content.Intent;
import android.content.res.TypedArray;
import android.os.Build;
import android.os.Bundle;
import android.util.Pair;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.image.ReactImageView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

public class NavigationStackView extends ViewGroup {
    private ArrayList<String> sceneKeys = new ArrayList<>();
    public static HashMap<String, SceneView> sceneItems = new HashMap<>();
    protected ReadableArray keys;
    private Activity mainActivity;
    private int oldCrumb = -1;
    private String oldKey;
    protected String enterAnim;
    protected String exitAnim;
    protected ReadableArray sharedElementNames;
    protected ReadableArray oldSharedElementNames;
    protected boolean finish = false;
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
    public void addView(View child, int index) {
        SceneView scene = (SceneView) child;
        sceneKeys.add(index, scene.sceneKey);
        sceneItems.put(scene.sceneKey, scene);
    }

    @Override
    public void removeViewAt(int index) {
        String sceneKey = sceneKeys.remove(index);
        sceneItems.remove(sceneKey);
    }

    protected void onAfterUpdateTransaction() {
        Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
        if (mainActivity == null)
            mainActivity = currentActivity;
        if (finish) {
            mainActivity.finish();
            return;
        }
        if (sceneItems.size() == 0)
            return;
        int crumb = keys.size() - 1;
        int currentCrumb = oldCrumb;
        if (crumb < currentCrumb) {
            Intent intent = new Intent(getContext(), SceneActivity.getActivity(crumb));
            String key = keys.getString(crumb);
            intent.putExtra(SceneActivity.KEY, key);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            int enter = getAnimationResourceId(enterAnim, activityCloseEnterAnimationId);
            int exit = getAnimationResourceId(exitAnim, activityCloseExitAnimationId);
            final HashMap<String, View> oldSharedElementsMap = getSharedElementMap();
            Pair[] oldSharedElements = (crumb < 20 && currentCrumb - crumb == 1) ? getSharedElements(oldSharedElementsMap, oldSharedElementNames) : null;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && oldSharedElements != null && oldSharedElements.length != 0) {
                final SharedElementTransitioner transitioner = new SharedElementTransitioner(currentActivity, getSharedElementSet(oldSharedElementNames));
                currentActivity.setEnterSharedElementCallback(new SharedElementCallback() {
                    @Override
                    public void onMapSharedElements(List<String> names, Map<String, View> elements) {
                        names.clear();
                        elements.clear();
                        for(int i = 0; i < oldSharedElementNames.size(); i++) {
                            String name = oldSharedElementNames.getString(i);
                            names.add(name);
                            if (oldSharedElementsMap.containsKey(name)) {
                                View oldSharedElement = oldSharedElementsMap.get(name);
                                elements.put(name, oldSharedElement);
                                SharedElementView oldSharedElementView = (SharedElementView) oldSharedElement.getParent();
                                transitioner.load(name, oldSharedElementView.exitTransition);
                            }
                        }
                    }
                });
                currentActivity.finishAfterTransition();
            } else {
                currentActivity.navigateUpTo(intent);
            }
            currentActivity.overridePendingTransition(enter, exit);
        }
        if (crumb > currentCrumb) {
            Intent[] intents = new Intent[crumb - currentCrumb];
            for(int i = 0; i < crumb - currentCrumb; i++) {
                int nextCrumb = currentCrumb + i + 1;
                Intent intent = new Intent(getContext(), SceneActivity.getActivity(nextCrumb));
                String key = keys.getString(nextCrumb);
                intent.putExtra(SceneActivity.KEY, key);
                intents[i] = intent;
            }
            int enter = getAnimationResourceId(enterAnim, activityOpenEnterAnimationId);
            int exit = getAnimationResourceId(exitAnim, activityOpenExitAnimationId);
            final HashMap<String, View> sharedElementsMap = getSharedElementMap();
            final Pair[] sharedElements = crumb - currentCrumb == 1 ? getSharedElements(sharedElementsMap, sharedElementNames) : null;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && sharedElements != null && sharedElements.length != 0) {
                intents[0].putExtra(SceneActivity.SHARED_ELEMENTS, getSharedElementSet(sharedElementNames));
                currentActivity.setExitSharedElementCallback(new SharedElementCallback() {
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
                @SuppressWarnings("unchecked")
                Bundle bundle = ActivityOptions.makeSceneTransitionAnimation(currentActivity, sharedElements).toBundle();
                currentActivity.startActivity(intents[0], bundle);
            } else {
                currentActivity.startActivities(intents);
            }
            currentActivity.overridePendingTransition(enter, exit);
        }
        if (crumb == currentCrumb && !keys.getString(crumb).equals(oldKey)) {
            Intent intent = new Intent(getContext(), SceneActivity.getActivity(crumb));
            String key = keys.getString(crumb);
            intent.putExtra(SceneActivity.KEY, key);
            int enter = getAnimationResourceId(enterAnim, activityOpenEnterAnimationId);
            int exit = getAnimationResourceId(exitAnim, activityOpenExitAnimationId);
            currentActivity.finish();
            currentActivity.startActivity(intent);
            currentActivity.overridePendingTransition(enter, exit);
        }
        oldCrumb = keys.size() - 1;
        oldKey = keys.getString(oldCrumb);
    }

    @Override
    public int getChildCount() {
        return sceneItems.size();
    }

    @Override
    public View getChildAt(int index) {
        return sceneItems.get(sceneKeys.get(index));
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        onAfterUpdateTransaction();
    }

    @Override
    public void onDetachedFromWindow() {
        if (keys.size() > 0) {
            Intent mainIntent = mainActivity.getIntent();
            mainIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            ((ThemedReactContext) getContext()).getCurrentActivity().navigateUpTo(mainIntent);
        }
        sceneItems.clear();
        super.onDetachedFromWindow();
    }

    private int getAnimationResourceId(String animationName, int defaultId) {
        if(((ThemedReactContext) getContext()).getCurrentActivity() == mainActivity)
            return -1;
        if (animationName == null)
            return defaultId;
        String packageName = getContext().getPackageName();
        return getContext().getResources().getIdentifier(animationName, "anim", packageName);
    }

    private HashSet<String> getSharedElementSet(ReadableArray sharedElementNames) {
        HashSet<String> sharedElementSet = new HashSet<>();
        for(int i = 0; i < sharedElementNames.size(); i++) {
            sharedElementSet.add(sharedElementNames.getString(i));
        }
        return sharedElementSet;
    }

    private HashMap<String, View> getSharedElementMap() {
        View contentView = ((ThemedReactContext) getContext()).getCurrentActivity().findViewById(android.R.id.content);
        HashSet<View> sharedElements = SharedElementManager.getSharedElements(contentView.getRootView());
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP || sharedElements == null)
            return null;
        HashMap<String, View> sharedElementMap = new HashMap<>();
        for(View sharedElement : sharedElements) {
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
        return sharedElementPairs.toArray(new Pair[sharedElementPairs.size()]);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}