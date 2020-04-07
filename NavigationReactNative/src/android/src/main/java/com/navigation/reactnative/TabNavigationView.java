package com.navigation.reactnative;

import android.content.Context;
import android.database.DataSetObserver;
import android.graphics.drawable.Drawable;
import android.view.Menu;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;

import com.google.android.material.badge.BadgeDrawable;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class TabNavigationView extends BottomNavigationView implements TabView {
    int defaultTextColor;
    int selectedTintColor;
    int unselectedTintColor;
    private ViewPager.OnPageChangeListener pageChangeListener;
    private DataSetObserver dataSetObserver;

    public TabNavigationView(Context context) {
        super(context);
        TabLayoutView tabLayout = new TabLayoutView(context);
        selectedTintColor = unselectedTintColor = defaultTextColor = tabLayout.defaultTextColor;
    }

    @Override
    public void setupWithViewPager(@Nullable final ViewPager viewPager) {
        if (viewPager != null && viewPager.getAdapter() != null) {
            final PagerAdapter pagerAdapter = viewPager.getAdapter();
            buildMenu(pagerAdapter);
            setOnNavigationItemSelectedListener(new OnNavigationItemSelectedListener() {
                @Override
                public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
                    viewPager.setCurrentItem(menuItem.getOrder(), false);
                    return true;
                }
            });
            if (pageChangeListener != null)
                viewPager.removeOnPageChangeListener(pageChangeListener);
            pageChangeListener = new ViewPager.OnPageChangeListener() {
                @Override
                public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
                }

                @Override
                public void onPageSelected(int position) {
                    setSelectedItemId(position);
                }

                @Override
                public void onPageScrollStateChanged(int state) {
                }
            };
            viewPager.addOnPageChangeListener(pageChangeListener);
            if (dataSetObserver != null)
                pagerAdapter.unregisterDataSetObserver(dataSetObserver);
            dataSetObserver = new DataSetObserver() {
                @Override
                public void onChanged() {
                    buildMenu(pagerAdapter);
                    setSelectedItemId(viewPager.getCurrentItem());
                }
            };
            pagerAdapter.registerDataSetObserver(dataSetObserver);
            setSelectedItemId(viewPager.getCurrentItem());
        }
    }

    private void buildMenu(PagerAdapter pagerAdapter) {
        getMenu().clear();
        for (int i = 0; i < pagerAdapter.getCount(); i++) {
            getMenu().add(Menu.NONE, i, i, pagerAdapter.getPageTitle(i));
        }
        requestLayout();
        post(measureAndLayout);
    }

    @Override
    public int getTabCount() {
        return getMenu().size();
    }

    public void setIcon(int index, Drawable icon) {
        getMenu().getItem(index).setIcon(icon);
    }

    @Override
    public BadgeDrawable getBadgeIcon(int index) {
        return getOrCreateBadge(index);
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
