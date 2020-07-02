package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableArray;
import com.google.android.material.badge.BadgeDrawable;
import com.google.android.material.bottomnavigation.BottomNavigationItemView;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class TabNavigationView extends BottomNavigationView implements TabView {
    boolean bottomTabs;
    int defaultTextColor;
    int selectedTintColor;
    int unselectedTintColor;
    private boolean layoutRequested = false;
    private boolean autoSelected = false;

    public TabNavigationView(Context context) {
        super(context);
        setBackground(null);
        TabLayoutView tabLayout = new TabLayoutView(context);
        selectedTintColor = unselectedTintColor = defaultTextColor = tabLayout.defaultTextColor;
        setOnNavigationItemSelectedListener(new OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
                TabBarView tabBar = getTabBar();
                if (!autoSelected && tabBar != null && tabBar.selectedTab == menuItem.getOrder())
                    tabBar.scrollToTop();
                if (tabBar != null && tabBar.selectedTab != menuItem.getOrder())
                    tabBar.setCurrentTab(menuItem.getOrder());
                return true;
            }
        });
    }

    void setTitles(ReadableArray titles) {
        int selectedIndex = getSelectedItemId();
        getMenu().clear();
        for(int i = 0; i < titles.size(); i++) {
            getMenu().add(Menu.NONE, i, i, titles.getString(i));
        }
        setSelectedItemId(selectedIndex);
        TabBarView tabBar = getTabBar();
        if (tabBar != null)
            tabBar.populateTabs();
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        TabBarView tabBar = getTabBar();
        if (bottomTabs && tabBar != null) {
            autoSelected = true;
            setSelectedItemId(tabBar.selectedTab);
            autoSelected = false;
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

    void tabSelected(int index) {
        autoSelected = true;
        setSelectedItemId(index);
        autoSelected = false;
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
    public void setTitle(int index, String title) {
        getMenu().getItem(index).setTitle(title);
    }

    public void setIcon(int index, Drawable icon) {
        getMenu().getItem(index).setIcon(icon);
    }

    @Override
    public BadgeDrawable getBadgeIcon(int index) {
        return getOrCreateBadge(index);
    }

    @Override
    public void removeBadgeIcon(int index) {
        removeBadge(index);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2 && getTouchables().size() > index) {
            BottomNavigationItemView itemView = (BottomNavigationItemView) getTouchables().get(index);
            itemView.getChildAt(0).getOverlay().clear();
        }
    }
}
