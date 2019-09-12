package com.navigation.reactnative;

import android.app.Activity;
import android.app.ActivityOptions;
import android.app.SharedElementCallback;
import android.content.Context;
import android.content.Intent;
import android.content.res.TypedArray;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Pair;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.image.ReactImageView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

public class NavigationStackView extends ViewGroup {
    private static final String ORIENTATION = "Navigation.ORIENTATION";
    private ArrayList<String> sceneKeys = new ArrayList<>();
    public static HashMap<String, SceneView> scenes = new HashMap<>();
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

    public NavigationStackView(Context context) {
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
        scenes.put(scene.sceneKey, scene);
    }

    @Override
    public void removeViewAt(int index) {
        String sceneKey = sceneKeys.remove(index);
        scenes.remove(sceneKey);
    }

    protected void onAfterUpdateTransaction() {
        Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
        if (currentActivity == null)
            return;
        if (mainActivity == null) {
            mainActivity = currentActivity;
            Uri uri = mainActivity.getIntent().getData();
            if (uri != null) {
                mainActivity.getIntent().setData(null);
                DeviceEventManagerModule deviceEventManagerModule = ((ThemedReactContext) getContext()).getNativeModule(DeviceEventManagerModule.class);
                deviceEventManagerModule.emitNewIntentReceived(uri);
            }
        }
        if (finish) {
            mainActivity.finish();
            return;
        }
        if (scenes.size() == 0)
            return;
        int crumb = keys.size() - 1;
        int currentCrumb = oldCrumb;
        if (crumb < currentCrumb) {
            FragmentManager fragmentManager = ((FragmentActivity) mainActivity).getSupportFragmentManager();
            fragmentManager.popBackStack(String.valueOf(crumb), 0);
        }
        if (crumb > currentCrumb) {
            FragmentManager fragmentManager = ((FragmentActivity) mainActivity).getSupportFragmentManager();
            FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
            int enter = getAnimationResourceId(enterAnim, activityOpenEnterAnimationId);
            int exit = getAnimationResourceId(exitAnim, activityOpenExitAnimationId);
            for(int i = 0; i < crumb - currentCrumb; i++) {
                int nextCrumb = currentCrumb + i + 1;
                String key = keys.getString(nextCrumb);
                String prevKey = nextCrumb > 0 ? keys.getString(nextCrumb - 1) : null;
                fragmentTransaction
                    .setCustomAnimations(enter, exit)
                    .add(((ViewGroup) this.getParent()).getId(), new SceneFragment(key), key);
                if (prevKey != null)
                    fragmentTransaction.hide(fragmentManager.findFragmentByTag(prevKey));
                fragmentTransaction.addToBackStack(String.valueOf(nextCrumb));
            }
            fragmentTransaction.commit();
        }
        if (crumb == currentCrumb && !oldKey.equals(keys.getString(crumb))) {
            Intent intent = new Intent(getContext(), SceneActivity.class);
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
        return scenes.size();
    }

    @Override
    public View getChildAt(int index) {
        return scenes.get(sceneKeys.get(index));
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        onAfterUpdateTransaction();
    }

    @Override
    public void onDetachedFromWindow() {
        /*Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
        if (keys.size() > 0 && currentActivity != null) {
            Intent mainIntent = mainActivity.getIntent();
            mainIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            currentActivity.navigateUpTo(mainIntent);
        }*/
        scenes.clear();
        super.onDetachedFromWindow();
    }

    private int getAnimationResourceId(String animationName, int defaultId) {
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
        Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
        if (!(currentActivity instanceof SceneActivity))
            return null;
        SceneView scene = ((SceneActivity) currentActivity).scene;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP)
            return null;
        HashMap<String, View> sharedElementMap = new HashMap<>();
        for(View sharedElement : scene.sharedElements) {
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
        return sharedElementPairs.toArray(new Pair[0]);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}