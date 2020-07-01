package com.navigation.reactnative;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.facebook.react.bridge.ReactContext;

import java.util.ArrayList;
import java.util.List;

public class TabBarView extends ViewGroup {
    List<TabFragment> tabFragments = new ArrayList<>();
    FragmentManager fragmentManager;
    int selectedTab = 0;
    int nativeEventCount;
    int mostRecentEventCount;

    public TabBarView(Context context) {
        super(context);
        FragmentActivity activity = (FragmentActivity) ((ReactContext) getContext()).getCurrentActivity();
        fragmentManager = activity != null ? activity.getSupportFragmentManager() : null;
    }

    void setCurrentTab(int index) {
        FragmentTransaction transaction = fragmentManager.beginTransaction();
        transaction.replace(getId(), tabFragments.get(index), "TabBar" + getId());
        transaction.commit();
        selectedTab = index;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        setCurrentTab(selectedTab);
    }

    void populateTabs() {
        TabNavigationView tabNavigation = getTabNavigation();
        if (tabNavigation != null) {
            for(int i = 0; i < tabFragments.size(); i++) {
                tabFragments.get(i).tabBarItem.setTabView(tabNavigation, i);
            }
        }
    }

    private TabNavigationView getTabNavigation() {
        ViewGroup parent = (ViewGroup) getParent();
        for(int i = 0; parent != null && i < parent.getChildCount(); i++) {
            View child = parent.getChildAt(i);
            if (child instanceof TabNavigationView)
                return (TabNavigationView) child;
        }
        return null;
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
