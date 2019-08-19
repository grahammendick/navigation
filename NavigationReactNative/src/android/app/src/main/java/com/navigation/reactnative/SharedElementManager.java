package com.navigation.reactnative;

import android.app.Activity;
import android.os.Build;
import android.view.View;
import android.view.ViewTreeObserver;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.HashSet;

public class SharedElementManager extends ViewGroupManager<SharedElementView> {

    @Override
    public String getName() {
        return "NVSharedElement";
    }

    @Override
    protected SharedElementView createViewInstance(final ThemedReactContext reactContext) {
        final SharedElementView view = new SharedElementView(reactContext);
        view.addOnAttachStateChangeListener(new View.OnAttachStateChangeListener() {
            @Override
            public void onViewAttachedToWindow(View v) {
                view.removeOnAttachStateChangeListener(this);
                HashSet<View> sharedElements = getSharedElements(reactContext.getCurrentActivity());
                View sharedElement = view.getChildAt(0);
                if (sharedElements != null && !sharedElements.contains(sharedElement)) {
                    setTransitionName(sharedElement, view.name);
                    sharedElements.add(sharedElement);
                }
            }

            @Override
            public void onViewDetachedFromWindow(View v) {
            }
        });
        view.getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
                view.getViewTreeObserver().removeOnPreDrawListener(this);
                View rootView = view.getRootView();
                SharedElementTransitioner transitioner = (SharedElementTransitioner) rootView.getTag(R.id.sharedElementTransitioner);
                if (transitioner != null)
                    transitioner.load(view.name, view.enterTransition);
                return true;
            }
        });
        return view;
    }

    @Override
    public void addView(SharedElementView parent, View child, int index) {
        super.addView(parent, child, index);
        Activity currentActivity = ((ThemedReactContext) parent.getContext()).getCurrentActivity();
        HashSet<View> sharedElements = getSharedElements(currentActivity);
        if (sharedElements != null && !sharedElements.contains(child))
            sharedElements.add(child);
    }

    @Override
    public void removeViewAt(SharedElementView parent, int index) {
        Activity currentActivity = ((ThemedReactContext) parent.getContext()).getCurrentActivity();
        HashSet<View> sharedElements = getSharedElements(currentActivity);
        View sharedElement = parent.getChildAt(0);
        if (sharedElements != null && sharedElements.contains(sharedElement)) {
            setTransitionName(sharedElement, null);
            sharedElements.remove(sharedElement);
        }
        super.removeViewAt(parent, index);
    }

    @ReactProp(name = "name")
    public void setName(SharedElementView view, String name) {
        view.name = name;
        setTransitionName(view.getChildAt(0), name);
    }

    private void setTransitionName(View sharedElement, String name) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && sharedElement != null)
            sharedElement.setTransitionName(name);
    }

    @ReactProp(name = "enterTransition")
    public void setEnterTransition(SharedElementView view, String enterTransition) {
        view.enterTransition = enterTransition;
    }

    @ReactProp(name = "exitTransition")
    public void setExitTransition(SharedElementView view, String exitTransition) {
        view.exitTransition = exitTransition;
    }
    
    @SuppressWarnings("unchecked")
    public static HashSet<View> getSharedElements(Activity activity) {
        String key = activity.getIntent().getStringExtra(SceneActivity.KEY);
        if (key == null)
            return null;
        final View sceneView = NavigationStackView.scenes.get(key);
        HashSet<View> sharedElements = (HashSet<View>) sceneView.getTag(R.id.sharedElements);
        if (sharedElements == null) {
            sharedElements = new HashSet<>();
            sceneView.setTag(R.id.sharedElements, sharedElements);
        }
        return sharedElements;
    }
}
