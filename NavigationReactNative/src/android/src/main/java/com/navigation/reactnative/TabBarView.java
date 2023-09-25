package com.navigation.reactnative;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ScrollView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.viewpager2.widget.ViewPager2;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.List;

public class TabBarView extends ViewGroup implements TabBarItemView.ChangeListener {
    final List<TabFragment> tabFragments = new ArrayList<>();
    private FragmentManager fragmentManager;
    private TabFragment selectedTabFragment;
    private Fragment fragment;
    int pendingSelectedTab = 0;
    int selectedTab = 0;
    boolean scrollsToTop;
    int nativeEventCount;
    int mostRecentEventCount;
    private int selectedIndex = 0;

    public TabBarView(Context context) {
        super(context);
        FragmentActivity activity = (FragmentActivity) ((ReactContext) getContext()).getCurrentActivity();
        if (activity != null) {
            fragment = new TabBarFragment(this);
            FragmentTransaction transaction = activity.getSupportFragmentManager().beginTransaction();
            transaction.add(fragment, "TabBar" + getId());
            transaction.commitNowAllowingStateLoss();
            fragmentManager = fragment.getChildFragmentManager();
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        setCurrentTab(selectedTab);
        populateTabs();
    }

    void populateTabs() {
        TabNavigationView tabNavigation = getTabNavigation();
        if (tabNavigation == null)
            return;
        tabNavigation.setTitles();
        for (int i = 0; i < tabFragments.size(); i++) {
            tabFragments.get(i).tabBarItem.setTabView(tabNavigation, i);
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

    void onAfterUpdateTransaction() {
        int eventLag = nativeEventCount - mostRecentEventCount;
        if (eventLag == 0 && pendingSelectedTab != selectedTab) {
            selectedTab = pendingSelectedTab;
            if (tabFragments.size() > selectedTab)
                setCurrentTab(selectedTab);
        }
        if (tabFragments.size() == 0)
            return;
        populateTabs();
        if (selectedTabFragment != null) {
            int reselectedTab = tabFragments.indexOf(selectedTabFragment);
            selectedTab = reselectedTab != -1 ? reselectedTab : Math.min(selectedTab, tabFragments.size() - 1);
        }
        setCurrentTab(selectedTab);
    }

    void setCurrentTab(int index) {
        if (index != selectedIndex) {
            nativeEventCount++;
            ReactContext reactContext = (ReactContext) getContext();
            EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
            eventDispatcher.dispatchEvent(new TabBarView.TabSelectedEvent(getId(), index, nativeEventCount));
            tabFragments.get(index).tabBarItem.pressed();
        }
        selectedTab = selectedIndex = index;
        selectedTabFragment = tabFragments.get(index);
        TabNavigationView tabNavigation = getTabNavigation();
        if (tabNavigation != null)
            tabNavigation.tabSelected(index);
        FragmentTransaction transaction = fragmentManager.beginTransaction();
        if (tabFragments.get(index).viewChanged())
            tabFragments.set(index, new TabFragment(tabFragments.get(index).tabBarItem));
        transaction.replace(getId(), tabFragments.get(index));
        transaction.commitNowAllowingStateLoss();
    }

    void scrollToTop() {
        if (!scrollsToTop)
            return;
        View tabBarItem = tabFragments.get(selectedTab).tabBarItem.content.get(0);
        if (tabBarItem instanceof ViewGroup) {
            ViewGroup viewGroup = (ViewGroup) tabBarItem;
            for(int i = 0; i < viewGroup.getChildCount(); i++) {
                if (viewGroup.getChildAt(i) instanceof NavigationBarView)
                    ((NavigationBarView) viewGroup.getChildAt(i)).setExpanded(true);
                if (viewGroup.getChildAt(i) instanceof ScrollView)
                    ((ScrollView) viewGroup.getChildAt(i)).smoothScrollTo(0,0);
                if (viewGroup.getChildAt(i) instanceof TabBarPagerView)
                    ((TabBarPagerView) viewGroup.getChildAt(i)).scrollToTop();
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

    void removeFragment() {
        FragmentActivity activity = (FragmentActivity) ((ReactContext) getContext()).getCurrentActivity();
        if (activity != null && fragment != null) {
            FragmentManager fragmentManager = activity.getSupportFragmentManager();
            FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
            fragmentTransaction.remove(fragment);
            fragmentTransaction.commitAllowingStateLoss();
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    public void onChange(TabBarItemView tabBarItemView) {
        TabFragment tabFragment = (TabFragment) fragmentManager.findFragmentById(getId());
        if (tabFragment != null && tabFragment.tabBarItem == tabBarItemView && tabFragment.viewChanged())
            setCurrentTab(selectedTab);
    }

    public static class TabBarFragment extends Fragment {
        private TabBarView tabBar;

        public TabBarFragment() {
            super();
        }

        TabBarFragment(TabBarView tabBar) {
            super();
            this.tabBar = tabBar;
        }

        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            return tabBar != null ? tabBar : new View(getContext());
        }
    }

    static class TabSelectedEvent extends Event<TabBarView.TabSelectedEvent> {
        private final int tab;
        private final int eventCount;

        public TabSelectedEvent(int viewId, int tab, int eventCount) {
            super(viewId);
            this.tab = tab;
            this.eventCount = eventCount;
        }

        @Override
        public String getEventName() {
            return "topOnTabSelected";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putInt("tab", this.tab);
            event.putInt("eventCount", this.eventCount);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }
}
