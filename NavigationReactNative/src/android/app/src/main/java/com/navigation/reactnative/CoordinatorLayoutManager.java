package com.navigation.reactnative;

import android.view.View;
import android.widget.ScrollView;

import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.material.appbar.AppBarLayout;

import javax.annotation.Nonnull;

public class CoordinatorLayoutManager extends ViewGroupManager<CoordinatorLayoutView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVCoordinatorLayout";
    }

    @Nonnull
    @Override
    protected CoordinatorLayoutView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new CoordinatorLayoutView(reactContext);
    }

    @ReactProp(name = "overlayTop")
    public void setOverlayTop(CoordinatorLayoutView view, int overlayTop) {
        view.overlayTop = overlayTop;
        if (view.getChildAt(1) != null) {
            CoordinatorLayout.LayoutParams params = (CoordinatorLayout.LayoutParams) view.getChildAt(1).getLayoutParams();
            if (params.getBehavior() != null)
                ((AppBarLayout.ScrollingViewBehavior) params.getBehavior()).setOverlayTop(overlayTop);
        }
    }

    @Override
    public void addView(CoordinatorLayoutView parent, View child, int index) {
        super.addView(parent, child, index);
        if (child instanceof ScrollView) {
            CoordinatorLayout.LayoutParams params = (CoordinatorLayout.LayoutParams) child.getLayoutParams();
            AppBarLayout.ScrollingViewBehavior behavior = new AppBarLayout.ScrollingViewBehavior();
            behavior.setOverlayTop(parent.overlayTop);
            params.setBehavior(behavior);
        }
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
}
