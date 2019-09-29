package com.navigation.reactnative;

import android.content.Context;
import android.content.res.TypedArray;

import com.google.android.material.tabs.TabLayout;

public class TabLayoutView extends TabLayout {
    int defaultTextColor;
    int defaultTabIndicatorColor;
    int selectedTintColor;
    int unselectedTintColor;

    public TabLayoutView(Context context) {
        super(context);
        selectedTintColor = unselectedTintColor = defaultTextColor = getTabTextColors().getDefaultColor();
        TypedArray layoutStyle = context.getTheme().obtainStyledAttributes(R.styleable.TabLayout);
        defaultTabIndicatorColor = layoutStyle.getColor(R.styleable.TabLayout_tabIndicatorColor, 0);
        layoutStyle.recycle();
    }

    void redraw() {
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
