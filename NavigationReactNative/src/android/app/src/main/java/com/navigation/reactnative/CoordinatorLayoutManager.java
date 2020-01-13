package com.navigation.reactnative;

import android.view.View;
import android.widget.ScrollView;

import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
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

    @Override
    public void addView(CoordinatorLayoutView parent, View child, int index) {
        super.addView(parent, child, index);
        if (child instanceof ScrollView) {
            CoordinatorLayout.LayoutParams params = (CoordinatorLayout.LayoutParams) child.getLayoutParams();
            params.setBehavior(new AppBarLayout.ScrollingViewBehavior());
        }
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
}
