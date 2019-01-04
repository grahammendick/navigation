package com.navigation.reactnative;

import android.os.Build;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.FrameLayout;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.HashSet;

public class SharedElementManager extends ViewGroupManager<FrameLayout> {

    @Override
    public String getName() {
        return "NVSharedElement";
    }

    @Override
    protected FrameLayout createViewInstance(ThemedReactContext reactContext) {
        final FrameLayout view = new FrameLayout(reactContext);
        view.addOnAttachStateChangeListener(new View.OnAttachStateChangeListener() {
            @Override
            public void onViewAttachedToWindow(View v) {
                View rootView = view.getRootView();
                HashSet<View> sharedElements = getSharedElements(rootView);
                if (sharedElements == null) {
                    sharedElements = new HashSet<>();
                    rootView.setTag(R.id.sharedElements, sharedElements);
                }
                if (!sharedElements.contains(view))
                    sharedElements.add(view);
            }

            @Override
            public void onViewDetachedFromWindow(View v) {
                view.removeOnAttachStateChangeListener(this);
                HashSet<View> sharedElements = getSharedElements(view.getRootView());
                if (sharedElements != null && sharedElements.contains(view))
                    sharedElements.remove(view);
            }
        });
        return view;
    }

    @ReactProp(name = "name")
    public void setName(FrameLayout view, String name) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
            view.setTransitionName(name);
    }

    @SuppressWarnings("unchecked")
    public static HashSet<View> getSharedElements(View rootView) {
        return (HashSet<View>) rootView.getTag(R.id.sharedElements);
    }
}
