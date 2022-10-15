package com.navigation.reactnative;

import android.view.View;
import android.view.ViewGroup;
import android.widget.ScrollView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.viewpager2.adapter.FragmentStateAdapter;
import androidx.viewpager2.widget.ViewPager2;

import java.util.ArrayList;
import java.util.List;

public class TabBarPagerRTLAdapter extends FragmentStateAdapter {
    private final List<TabBarItemView> tabBarItems = new ArrayList<>();
    final Fragment fragment;
    int selectedTab = 0;
    boolean scrollsToTop;
    int nativeEventCount;
    int mostRecentEventCount;
    boolean dataSetChanged = false;

    public TabBarPagerRTLAdapter(@NonNull Fragment fragment) {
        super(fragment);
        this.fragment = fragment;
    }

    void populateTabs(TabLayoutRTLView tabView) {
        if (tabView == null || tabView.getTabCount() != tabBarItems.size())
            return;
        for(int i = 0; i < tabBarItems.size(); i++) {
            tabBarItems.get(i).setTabView(tabView, i);
        }
    }

    void scrollToTop() {
        if (!scrollsToTop)
            return;
        View tabBarItem = getTabAt(selectedTab).content.get(0);
        if (tabBarItem instanceof ViewGroup) {
            ViewGroup viewGroup = (ViewGroup) tabBarItem;
            for(int i = 0; i < viewGroup.getChildCount(); i++) {
                if (viewGroup.getChildAt(i) instanceof NavigationBarView)
                    ((NavigationBarView) viewGroup.getChildAt(i)).setExpanded(true);
                if (viewGroup.getChildAt(i) instanceof ScrollView)
                    ((ScrollView) viewGroup.getChildAt(i)).smoothScrollTo(0,0);
                if (viewGroup.getChildAt(i) instanceof ViewPager2)
                    TabBarPagerRTLManager.getAdapter((ViewPager2) viewGroup.getChildAt(i)).scrollToTop();
            }
        }
        if (tabBarItem instanceof ScrollView)
            ((ScrollView) tabBarItem).smoothScrollTo(0, 0);
        if (tabBarItem instanceof NavigationStackView)
            ((NavigationStackView) tabBarItem).scrollToTop();
    }

    int getTabsCount() {
        return tabBarItems.size();
    }

    TabBarItemView getTabAt(int index) {
        return tabBarItems.get(index);
    }

    void addTab(TabBarItemView tab, int index) {
        tabBarItems.add(index, tab);
        tab.changeListener = tabBarItemView -> notifyItemChanged(index);
        dataSetChanged = true;
        notifyItemInserted(index);
        dataSetChanged = false;
    }

    void removeTab(int index) {
        TabBarItemView tab = tabBarItems.remove(index);
        tab.changeListener = null;
        dataSetChanged = true;
        notifyItemRemoved(index);
        dataSetChanged = false;
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        return new TabFragment(tabBarItems.get(position));
    }

    @Override
    public int getItemCount() {
        return tabBarItems.size();
    }

    @Override
    public long getItemId(int position) {
        return tabBarItems.get(position).content.get(0).hashCode();
    }
}
