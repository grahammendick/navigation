package com.navigation.reactnative;

import android.content.Context;
import android.database.DataSetObserver;
import android.graphics.drawable.Drawable;

import androidx.annotation.Nullable;
import androidx.viewpager.widget.ViewPager;

import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.tabs.TabLayout;

public class TabLayoutView extends TabLayout implements TabView {
    int defaultTextColor;
    int selectedTintColor;
    int unselectedTintColor;

    public TabLayoutView(Context context) {
        super(context);
        AppBarLayout.LayoutParams params = new AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT);
        params.setScrollFlags(0);
        setLayoutParams(params);
        if (getTabTextColors() != null)
            selectedTintColor = unselectedTintColor = defaultTextColor = getTabTextColors().getDefaultColor();
        setSelectedTabIndicatorColor(defaultTextColor);
    }

    public void setScrollable(boolean scrollable) {
        setTabMode(scrollable ? TabLayout.MODE_SCROLLABLE : TabLayout.MODE_FIXED);
        post(measureAndLayout);
    }

    @Override
    public void setupWithViewPager(@Nullable ViewPager viewPager) {
        super.setupWithViewPager(viewPager);
        post(measureAndLayout);
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

    @Override
    public void setTitle(int index, String title) {
        TabLayout.Tab tab = getTabAt(index);
        if (tab != null)
            tab.setText(title);
    }

    public void setIcon(int index, Drawable icon) {
        TabLayout.Tab tab = getTabAt(index);
        if (tab != null)
            tab.setIcon(icon);
    }

    public Runnable getMeasureAndLayout() {
        return measureAndLayout;
    }

    final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };
}
