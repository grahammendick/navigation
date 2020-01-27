package com.navigation.reactnative;

import android.content.Context;
import android.widget.ScrollView;

import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.uimanager.PixelUtil;

public class CoordinatorLayoutView extends CoordinatorLayout {
    int overlap = 0;

    public CoordinatorLayoutView(Context context){
        super(context);
    }

    @Override
    public void onAttachedToWindow() {
        super.onAttachedToWindow();
        requestLayout();
        post(measureAndLayout);
    }

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            measure(
                    MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };

    private NavigationBarView getNavigationBarView() {
        for(int i = 0; i < getChildCount(); i++) {
            if (getChildAt(i) instanceof NavigationBarView)
                return (NavigationBarView) getChildAt(i);
        }
        return null;
    }

    ScrollView getScrollView() {
        for(int i = 0; i < getChildCount(); i++) {
            if (getChildAt(i) instanceof ScrollView)
                return (ScrollView) getChildAt(i);
        }
        return null;
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int height = MeasureSpec.getSize(heightMeasureSpec);
        int contentHeight = getScrollView() != null ? getScrollView().getChildAt(0).getHeight() : 0;
        boolean collapsingBar = getNavigationBarView() != null && getNavigationBarView().getChildAt(0) instanceof CollapsingBarView;
        int navigationBarHeight = collapsingBar ? (int) PixelUtil.toPixelFromDIP(56) : 0;
        int collapsedGap = height + 2 - contentHeight - navigationBarHeight;
        if (collapsedGap > 0)
            heightMeasureSpec = MeasureSpec.makeMeasureSpec(MeasureSpec.getSize(heightMeasureSpec) - collapsedGap, MeasureSpec.EXACTLY);
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }
}
