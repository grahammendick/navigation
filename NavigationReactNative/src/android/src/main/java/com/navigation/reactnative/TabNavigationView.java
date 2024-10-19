package com.navigation.reactnative;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.google.android.material.badge.BadgeDrawable;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class TabNavigationView extends BottomNavigationView implements TabView {
    final int defaultTextColor;
    int selectedTintColor;
    int unselectedTintColor;
    int defaultActiveIndicatorColor;
    int defaultRippleColor;
    final int defaultShadowColor;
    private boolean layoutRequested = false;
    private boolean autoSelected = false;

    public TabNavigationView(Context context) {
        super(context);
        setLayoutDirection(!I18nUtil.getInstance().isRTL(context) ? LAYOUT_DIRECTION_LTR : LAYOUT_DIRECTION_RTL);
        setBackground(null);
        TabLayoutView tabLayout = new TabLayoutView(context);
        selectedTintColor = unselectedTintColor = defaultTextColor = tabLayout.defaultTextColor;
        defaultActiveIndicatorColor = getItemActiveIndicatorColor() != null ? getItemActiveIndicatorColor().getDefaultColor() : Color.WHITE;
        defaultRippleColor = getItemRippleColor() != null ? getItemRippleColor().getColorForState(new int[]{ android.R.attr.state_pressed }, Color.WHITE) : Color.WHITE;
        defaultShadowColor = getOutlineAmbientShadowColor();
        setOnItemSelectedListener(menuItem -> {
            TabBarView tabBar = getTabBar();
            if (!autoSelected && tabBar != null && tabBar.selectedTab == menuItem.getOrder())
                tabBar.scrollToTop();
            if (tabBar != null && tabBar.selectedTab != menuItem.getOrder()) {
                if (tabBar.foucCounter == getTabBar().tabFragments.get(menuItem.getOrder()).tabBarItem.foucCounter) {
                    tabBar.setCurrentTab(menuItem.getOrder());
                } else {
                    tabBar.selectTab(menuItem.getOrder());
                    return false;
                }
            }
            return true;
        });
    }

    void setTitles() {
        TabBarView tabBar = getTabBar();
        for (int i = 0; tabBar != null && i < tabBar.tabFragments.size(); i++) {
            CharSequence title = getTabBar().tabFragments.get(i).tabBarItem.styledTitle;
            MenuItem item = getMenu().findItem(i);
            if (item != null && item.getTitle() != title)
                item.setTitle(title);
            if (item == null)
                getMenu().add(Menu.NONE, i, i, title);
        }
        assert tabBar != null;
        for(int i = getMenu().size() - 1; i >= tabBar.tabFragments.size(); i--) {
            getMenu().removeItem(i);
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        TabBarView tabBar = getTabBar();
        if (tabBar != null) {
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

    private final Runnable measureAndLayout = () -> {
        layoutRequested = false;
        measure(
            MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
    };

    @Override
    public void setTitle(int index, CharSequence title) {
        getMenu().getItem(index).setTitle(title);
    }

    public void setIcon(int index, Drawable icon) {
        getMenu().getItem(index).setIcon(icon);
    }

    @Override
    public void setTestID(int index, String testID) {
        if (getTouchables().size() > index) {
            View itemView = getTouchables().get(index);
            itemView.setTag(testID);
        }
    }

    @Override
    public BadgeDrawable getBadgeIcon(int index) {
        return getOrCreateBadge(index);
    }

    @Override
    public void removeBadgeIcon(int index) {
        removeBadge(index);
        if (getTouchables().size() > index) {
            ViewGroup itemView = (ViewGroup) getTouchables().get(index);
            itemView.getChildAt(0).getOverlay().clear();
        }
    }
}
