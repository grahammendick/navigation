package com.navigation.reactnative;

import android.content.Context;
import android.database.DataSetObserver;

import androidx.annotation.Nullable;
import androidx.viewpager.widget.ViewPager;

import com.google.android.material.tabs.TabLayout;

public class TabLayoutView extends TabLayout {
    int defaultTextColor;
    int selectedTintColor;
    int unselectedTintColor;

    public TabLayoutView(Context context) {
        super(context);
        selectedTintColor = unselectedTintColor = defaultTextColor = getTabTextColors().getDefaultColor();
        setSelectedTabIndicatorColor(defaultTextColor);
    }

    @Override
    public void setupWithViewPager(@Nullable ViewPager viewPager) {
        super.setupWithViewPager(viewPager);
        if (viewPager != null && viewPager.getAdapter() != null) {
            viewPager.getAdapter().registerDataSetObserver(new DataSetObserver() {
                @Override
                public void onChanged() {
                    super.onChanged();
                    post(measureAndLayout);
                }
            });
        }
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
