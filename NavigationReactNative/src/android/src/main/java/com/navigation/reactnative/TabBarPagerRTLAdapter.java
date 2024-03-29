package com.navigation.reactnative;

import android.view.View;
import android.view.ViewGroup;
import android.widget.ScrollView;

import androidx.annotation.NonNull;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.adapter.FragmentStateAdapter;
import androidx.viewpager2.widget.ViewPager2;

import java.util.ArrayList;
import java.util.List;

public class TabBarPagerRTLAdapter extends FragmentStateAdapter {
    private final List<TabBarItemView> tabBarItems = new ArrayList<>();
    final Fragment fragment;
    int pendingSelectedTab = 0;
    int selectedTab = 0;
    boolean scrollsToTop;
    int nativeEventCount;
    int mostRecentEventCount;
    boolean dataSetChanged = false;
    private boolean onAfterUpdateTransactionRequested = false;
    boolean jsUpdate = false;

    public TabBarPagerRTLAdapter(@NonNull Fragment fragment) {
        super(fragment);
        this.fragment = fragment;
    }

    void onAfterUpdateTransaction(ViewPager2 view) {
        onAfterUpdateTransactionRequested = false;
        int eventLag = nativeEventCount - mostRecentEventCount;
        if (eventLag == 0 && view.getCurrentItem() != pendingSelectedTab) {
            selectedTab = pendingSelectedTab;
            if (getTabsCount() > selectedTab)
                setCurrentItem(view, selectedTab);
        }
        populateTabs(getTabLayout(view));
        if (getTabsCount() > 0) {
            selectedTab = Math.min(selectedTab, getTabsCount() - 1);
            setCurrentItem(view, selectedTab);
        }
    }

    void setCurrentItem(ViewPager2 view, int selectedTab) {
        view.post(() -> {
            view.measure(
                View.MeasureSpec.makeMeasureSpec(view.getWidth(), View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(view.getHeight(), View.MeasureSpec.EXACTLY));
            view.layout(view.getLeft(), view.getTop(), view.getRight(), view.getBottom());
        });
        view.setCurrentItem(selectedTab, false);
    }

    void requestOnAfterUpdateTransaction(ViewPager2 view) {
        if (!onAfterUpdateTransactionRequested) {
            onAfterUpdateTransactionRequested = true;
            view.post(() -> {
                if (onAfterUpdateTransactionRequested) onAfterUpdateTransaction(view);
            });
        }
    }

    TabLayoutRTLView getTabLayout(View view) {
        ViewGroup parent = (ViewGroup) view.getParent();
        if (parent instanceof CoordinatorLayout) {
            parent = (ViewGroup) parent.getChildAt(0);
            if (parent.getChildAt(0) instanceof CollapsingBarView)
                parent = (ViewGroup) parent.getChildAt(0);
        }
        for(int i = 0; parent != null && i < parent.getChildCount(); i++) {
            View child = parent.getChildAt(i);
            if (child instanceof TabView)
                return (TabLayoutRTLView) child;
        }
        return null;
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
                if (viewGroup.getChildAt(i) instanceof BottomAppBarView)
                    ((BottomAppBarView) viewGroup.getChildAt(i)).performShow();
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
        return tabBarItems.size() > index ? tabBarItems.get(index) : null;
    }

    void addTab(TabBarItemView tab, int index) {
        tabBarItems.add(index, tab);
        tab.changeListener = tabBarItemView -> notifyItemChanged(tabBarItems.indexOf(tab));
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
        return tabBarItems.get(position).content.size() > 0 ? tabBarItems.get(position).content.get(0).hashCode() : RecyclerView.NO_ID;
    }
}
