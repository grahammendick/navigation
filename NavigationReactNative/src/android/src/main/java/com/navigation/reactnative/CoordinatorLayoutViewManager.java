package com.navigation.reactnative;

import android.view.View;
import android.widget.ScrollView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.viewpager.widget.ViewPager;
import androidx.viewpager2.widget.ViewPager2;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVCoordinatorLayoutManagerDelegate;
import com.facebook.react.viewmanagers.NVCoordinatorLayoutManagerInterface;
import com.google.android.material.appbar.AppBarLayout;

import javax.annotation.Nonnull;

public class CoordinatorLayoutViewManager extends ViewGroupManager<CoordinatorLayoutView> implements NVCoordinatorLayoutManagerInterface<CoordinatorLayoutView> {
    private final ViewManagerDelegate<CoordinatorLayoutView> delegate;

    public CoordinatorLayoutViewManager() {
        delegate = new NVCoordinatorLayoutManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<CoordinatorLayoutView> getDelegate() {
        return delegate;
    }

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

    @ReactProp(name = "overlap")
    public void setOverlap(CoordinatorLayoutView view, int overlap) {
        view.overlap = overlap;
        if (view.getScrollView() != null) {
            CoordinatorLayout.LayoutParams params = (CoordinatorLayout.LayoutParams) view.getScrollView().getLayoutParams();
            if (params.getBehavior() != null)
                ((AppBarLayout.ScrollingViewBehavior) params.getBehavior()).setOverlayTop(overlap);
        }
    }

    @Override
    public void addView(@NonNull CoordinatorLayoutView parent, @NonNull View child, int index) {
        super.addView(parent, child, index);
        if (child instanceof ScrollView || child instanceof ViewPager || child instanceof ViewPager2) {
            CoordinatorLayout.LayoutParams params = (CoordinatorLayout.LayoutParams) child.getLayoutParams();
            AppBarLayout.ScrollingViewBehavior behavior = new AppBarLayout.ScrollingViewBehavior();
            behavior.setOverlayTop(parent.overlap);
            params.setBehavior(behavior);
        }
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
}
