package com.navigation.reactnative;

import android.content.Context;

import androidx.coordinatorlayout.widget.CoordinatorLayout;

public class CoordinatorLayoutView extends CoordinatorLayout {

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
}
