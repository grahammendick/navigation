package com.navigation.reactnative;

import android.content.Context;
import android.database.DataSetObserver;
import android.graphics.drawable.Drawable;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ScrollView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;

import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class TabNavigationView extends BottomNavigationView implements TabView {
    boolean bottomTabs;
    int defaultTextColor;
    int selectedTintColor;
    int unselectedTintColor;
    private ViewPager.OnPageChangeListener pageChangeListener;
    private DataSetObserver dataSetObserver;
    private boolean layoutRequested = false;
    private boolean autoSelected = false;

    public TabNavigationView(Context context) {
        super(context);
        TabLayoutView tabLayout = new TabLayoutView(context);
        selectedTintColor = unselectedTintColor = defaultTextColor = tabLayout.defaultTextColor;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        TabBarView tabBar = getTabBar();
        if (bottomTabs && tabBar != null) {
            setupWithViewPager(tabBar);
            tabBar.populateTabs();
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
                    if (!autoSelected && viewPager.getCurrentItem() == menuItem.getOrder()) {
                        View tab = ((TabBarView) viewPager).getTabAt(0);
                        if (tab instanceof CoordinatorLayout) {
                            CoordinatorLayout coordinatorLayout = (CoordinatorLayout) tab;
                            for(int i = 0; i < coordinatorLayout.getChildCount(); i++) {
                                if (coordinatorLayout.getChildAt(i) instanceof AppBarLayout)
                                    ((AppBarLayout) coordinatorLayout.getChildAt(i)).setExpanded(true);
                                if (coordinatorLayout.getChildAt(i) instanceof ScrollView)
                                    ((ScrollView) coordinatorLayout.getChildAt(i)).smoothScrollTo(0,0);
                            }
                        }
                    }
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
                    autoSelected = true;
                    setSelectedItemId(position);
                    autoSelected = false;
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
            autoSelected = true;
            setSelectedItemId(viewPager.getCurrentItem());
            autoSelected = false;
        }
    }

    private void buildMenu(PagerAdapter pagerAdapter) {
        getMenu().clear();
        for (int i = 0; i < pagerAdapter.getCount(); i++) {
            getMenu().add(Menu.NONE, i, i, pagerAdapter.getPageTitle(i));
        }
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        if (!layoutRequested) {
            layoutRequested = true;
            post(measureAndLayout);
        }
    }

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            layoutRequested = false;
            measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };

    @Override
    public int getTabCount() {
        return getMenu().size();
    }

    @Override
    public void setTitle(int index, String title) {
        getMenu().getItem(index).setTitle(title);
    }

    public void setIcon(int index, Drawable icon) {
        getMenu().getItem(index).setIcon(icon);
    }
}
