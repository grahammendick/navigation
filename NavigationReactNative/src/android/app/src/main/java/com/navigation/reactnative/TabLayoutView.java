package com.navigation.reactnative;

import android.content.Context;

import com.google.android.material.tabs.TabLayout;

public class TabLayoutView extends TabLayout {

    public TabLayoutView(Context context) {
        super(context);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
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
