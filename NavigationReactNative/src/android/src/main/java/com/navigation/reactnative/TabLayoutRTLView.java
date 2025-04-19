package com.navigation.reactnative;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.Nullable;
import androidx.viewpager2.widget.ViewPager2;

import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.appbar.CollapsingToolbarLayout;
import com.google.android.material.badge.BadgeDrawable;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;

public class TabLayoutRTLView extends TabLayout implements TabView {
    int defaultTextColor;
    int selectedTintColor;
    int unselectedTintColor;
    int defaultRippleColor;
    private boolean layoutRequested = false;

    public TabLayoutRTLView(Context context) {
        super(context);
        setLayoutDirection(LAYOUT_DIRECTION_RTL);
        AppBarLayout.LayoutParams params = new AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT);
        params.setScrollFlags(0);
        setLayoutParams(params);
        if (getTabTextColors() != null)
            selectedTintColor = unselectedTintColor = defaultTextColor = getTabTextColors().getDefaultColor();
        setSelectedTabIndicatorColor(defaultTextColor);
        defaultRippleColor = getTabRippleColor() != null ? getTabRippleColor().getColorForState(new int[]{ android.R.attr.state_pressed }, Color.WHITE) : Color.WHITE;
        addOnTabSelectedListener(new OnTabSelectedListener() {
            @Override
            public void onTabSelected(Tab tab) {
            }

            @Override
            public void onTabUnselected(Tab tab) {
            }

            @Override
            public void onTabReselected(Tab tab) {
                ViewPager2 tabBarPager = getTabBar();
                if (tabBarPager != null && tabBarPager.getAdapter() != null)
                    ((TabBarPagerRTLAdapter) tabBarPager.getAdapter()).scrollToTop();
            }
        });
    }

    public void setScrollable(boolean scrollable) {
        setTabMode(scrollable ? TabLayout.MODE_SCROLLABLE : TabLayout.MODE_FIXED);
    }

    @Override
    public void setLayoutParams(ViewGroup.LayoutParams params) {
        super.setLayoutParams(params);
        if (params instanceof CollapsingToolbarLayout.LayoutParams) {
            ((CollapsingToolbarLayout.LayoutParams) params).gravity = Gravity.BOTTOM;
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        this.setVisibility(this.getTabCount() > 0 ? View.VISIBLE : View.INVISIBLE);
        final ViewPager2 tabBarPager = getTabBar();
        if (tabBarPager != null && tabBarPager.getAdapter() != null) {
            this.setVisibility(View.VISIBLE);
            ((TabBarPagerRTLAdapter) tabBarPager.getAdapter()).attach(this, tabBarPager);
            TabBarPagerRTLManager.getAdapter(tabBarPager).populateTabs(this);
        }
    }

    private ViewPager2 getTabBar() {
        ViewGroup parent = (ViewGroup) getParent();
        if (parent instanceof CoordinatorLayoutView)
            return null;
        if (parent instanceof NavigationBarView)
            parent = (ViewGroup) parent.getParent();
        for(int i = 0; parent != null && i < parent.getChildCount(); i++) {
            View child = parent.getChildAt(i);
            if (child instanceof ViewPager2)
                return (ViewPager2) child;
        }
        return null;
    }

    @Override
    public void selectTab(@Nullable Tab tab) {
        ViewPager2 tabBar = getTabBar();
        if (tabBar == null || tab == null) {
            super.selectTab(tab);
            return;
        }
        TabBarPagerRTLAdapter adapter = (TabBarPagerRTLAdapter) tabBar.getAdapter();
        assert adapter != null;
        TabBarItemView tabBarItem = adapter.getTabAt(tab.getPosition());
        if (getSelectedTabPosition() == tab.getPosition() || tabBarItem.foucCounter == adapter.foucCounter) {
            super.selectTab(tab);
        } else {
            adapter.selectTab(tabBar, tab.getPosition());
        }
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (getParent() instanceof CollapsingBarView parent) {
            for(int i = 0; i < parent.getChildCount(); i++) {
                View child = parent.getChildAt(i);
                if (child instanceof ToolbarView) {
                    if (child.getLayoutParams() instanceof CollapsingToolbarLayout.LayoutParams)
                        ((CollapsingToolbarLayout.LayoutParams) child.getLayoutParams()).setMargins(0, 0, 0, h);
                }
            }
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

    private final Runnable measureAndLayout = () -> {
        layoutRequested = false;
        measure(
            MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
    };

    @Override
    public void setTitle(int index, CharSequence title) {
        TabLayout.Tab tab = getTabAt(index);
        if (tab != null)
            tab.setText(title);
    }

    public void setIcon(int index, Drawable icon) {
        TabLayout.Tab tab = getTabAt(index);
        if (tab != null)
            tab.setIcon(icon);
    }

    @Override
    public void setTestID(int index, String testID) {
        TabLayout.Tab tab = getTabAt(index);
        if (tab != null)
            tab.view.setTag(testID);
    }

    @Override
    public BadgeDrawable getBadgeIcon(int index) {
        TabLayout.Tab tab = getTabAt(index);
        return tab != null ? tab.getOrCreateBadge() : null;
    }

    @Override
    public void removeBadgeIcon(int index) {
        TabLayout.Tab tab = getTabAt(index);
        if (tab != null)
            tab.removeBadge();
    }
}
