package com.navigation.reactnative;

import android.content.Context;
import android.database.DataSetObserver;
import android.graphics.drawable.Drawable;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;

import com.google.android.material.bottomnavigation.BottomNavigationView;

public class TabNavigationView extends BottomNavigationView implements TabView {
    int defaultTextColor;
    int selectedTintColor;
    int unselectedTintColor;

    public TabNavigationView(Context context) {
        super(context);
        TabLayoutView tabLayout = new TabLayoutView(context);
        selectedTintColor = unselectedTintColor = defaultTextColor = tabLayout.defaultTextColor;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        TabBarView tabBar = getTabBar();
        if (tabBar != null) {
            setupWithViewPager(tabBar);
            tabBar.populateTabIcons();
        }
    }

    private TabBarView getTabBar() {
        for(int i = 0; getParent() != null && i < ((ViewGroup) getParent()).getChildCount(); i++) {
            View child = ((ViewGroup) getParent()).getChildAt(i);
            if (child instanceof TabBarView)
                return (TabBarView) child;
        }
        return null;
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
            viewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
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
            });
            pagerAdapter.registerDataSetObserver(new DataSetObserver() {
                @Override
                public void onChanged() {
                    buildMenu(pagerAdapter);
                    setSelectedItemId(viewPager.getCurrentItem());
                    post(measureAndLayout);
                }
            });
        }
    }

    private void buildMenu(PagerAdapter pagerAdapter) {
        getMenu().clear();
        for (int i = 0; i < pagerAdapter.getCount(); i++) {
            getMenu().add(Menu.NONE, i, i, pagerAdapter.getPageTitle(i));
        }
    }

    @Override
    public int getTabCount() {
        return getMenu().size();
    }

    public void setIcon(int index, Drawable icon) {
        getMenu().getItem(index).setIcon(icon);
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
