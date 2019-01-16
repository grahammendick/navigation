package com.navigation.reactnative;

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
    protected SharedElementView createViewInstance(ThemedReactContext reactContext) {
        final SharedElementView view = new SharedElementView(reactContext);
        view.addOnAttachStateChangeListener(new View.OnAttachStateChangeListener() {
            @Override
            public void onViewAttachedToWindow(View v) {
                View rootView = view.getRootView();
                HashSet<View> sharedElements = getSharedElements(rootView);
                if (sharedElements == null) {
                    sharedElements = new HashSet<>();
                    rootView.setTag(R.id.sharedElements, sharedElements);
                }
                View sharedElement = view.getChildAt(0);
                if (!sharedElements.contains(sharedElement)) {
                    sharedElement.setTransitionName(view.getName());
                    sharedElements.add(sharedElement);
                }
            }

            @Override
            public void onViewDetachedFromWindow(View v) {
                view.removeOnAttachStateChangeListener(this);
                HashSet<View> sharedElements = getSharedElements(view.getRootView());
                View sharedElement = view.getChildAt(0);
                if (sharedElements != null && sharedElements.contains(sharedElement)) {
                    sharedElement.setTransitionName(null);
                    sharedElements.remove(sharedElement);
                }
            }
        });
        view.getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
                view.getViewTreeObserver().removeOnPreDrawListener(this);
                View rootView = view.getRootView();
                SharedElementTransitioner transitioner = (SharedElementTransitioner) rootView.getTag(R.id.sharedElementTransitioner);
                if (transitioner != null)
                    transitioner.load(view.getName(), view.getEnterTransition());
                return true;
            }
        });
        return view;
    }

    @Override
    public void addView(SharedElementView parent, View child, int index) {
        super.addView(parent, child, index);
        HashSet<View> sharedElements = getSharedElements(parent.getRootView());
        if (sharedElements != null && !sharedElements.contains(child))
            sharedElements.add(child);
    }

    @Override
    public void removeViewAt(SharedElementView parent, int index) {
        HashSet<View> sharedElements = getSharedElements(parent.getRootView());
        View sharedElement = parent.getChildAt(0);
        if (sharedElements != null && sharedElements.contains(sharedElement)) {
            sharedElement.setTransitionName(null);
            sharedElements.remove(sharedElement);
        }
        super.removeViewAt(parent, index);
    }

    @ReactProp(name = "name")
    public void setName(SharedElementView view, String name) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
            view.setName(name);
        View sharedElement = view.getChildAt(0);
        if (sharedElement != null)
            sharedElement.setTransitionName(name);
    }

    @ReactProp(name = "enterTransition")
    public void setEnterTransition(SharedElementView view, String enterTransition) {
        view.setEnterTransition(enterTransition);
    }

    @ReactProp(name = "exitTransition")
    public void setExitTransition(SharedElementView view, String exitTransition) {
        view.setExitTransition(exitTransition);
    }
    
    @SuppressWarnings("unchecked")
    public static HashSet<View> getSharedElements(View rootView) {
        return (HashSet<View>) rootView.getTag(R.id.sharedElements);
    }
}
