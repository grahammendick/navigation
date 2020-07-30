package com.navigation.reactnative;

import android.content.Context;
import android.database.DataSetObserver;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ScrollView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.fragment.app.FragmentTransaction;
import androidx.viewpager.widget.ViewPager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.NativeGestureUtil;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.List;

public class TabBarPagerView extends ViewPager {
    private Fragment fragment;
    int selectedTab = 0;
    boolean scrollsToTop;
    private boolean layoutRequested = false;
    int nativeEventCount;
    int mostRecentEventCount;
    private boolean dataSetChanged = false;

    public TabBarPagerView(Context context) {
        super(context);
        addOnPageChangeListener(new TabChangeListener());
        FragmentActivity activity = (FragmentActivity) ((ReactContext) context).getCurrentActivity();
        fragment = new TabBarPagerFragment(this);
        if (activity != null) {
            FragmentTransaction transaction = activity.getSupportFragmentManager().beginTransaction();
            transaction.add(fragment, "TabBarPager" + getId());
            transaction.commitNowAllowingStateLoss();
        }
        Adapter adapter = new Adapter(fragment.getChildFragmentManager());
        adapter.registerDataSetObserver(new DataSetObserver() {
            @Override
            public void onChanged() {
                if (getCurrentItem() != selectedTab && getTabsCount() > selectedTab)
                    setCurrentItem(selectedTab, false);
            }
        });
        setAdapter(adapter);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        requestLayout();
        if (getTabLayout() != null)
            getTabLayout().setupWithViewPager(this);
        populateTabs();
    }

    void populateTabs() {
        TabLayoutView tabView = getTabLayout();
        if (tabView != null && getAdapter() != null) {
            for(int i = 0; i < getAdapter().tabFragments.size(); i++) {
                getAdapter().tabFragments.get(i).tabBarItem.setTabView(tabView, i);
            }
        }
    }

    private TabLayoutView getTabLayout() {
        ViewGroup parent = (ViewGroup) getParent();
        if (parent instanceof CoordinatorLayout) {
            parent = (ViewGroup) parent.getChildAt(0);
            if (parent.getChildAt(0) instanceof CollapsingBarView)
                parent = (ViewGroup) parent.getChildAt(0);
        }
        for(int i = 0; parent != null && i < parent.getChildCount(); i++) {
            View child = parent.getChildAt(i);
            if (child instanceof TabView)
                return (TabLayoutView) child;
        }
        return null;
    }

    void scrollToTop() {
        if (!scrollsToTop)
            return;
        View tabBarItem = getTabAt(getCurrentItem()).content.get(0);
        if (tabBarItem instanceof ViewGroup) {
            ViewGroup viewGroup = (ViewGroup) tabBarItem;
            for(int i = 0; i < viewGroup.getChildCount(); i++) {
                if (viewGroup.getChildAt(i) instanceof NavigationBarView)
                    ((NavigationBarView) viewGroup.getChildAt(i)).setExpanded(true);
                if (viewGroup.getChildAt(i) instanceof ScrollView)
                    ((ScrollView) viewGroup.getChildAt(i)).smoothScrollTo(0,0);
                if (viewGroup.getChildAt(i) instanceof TabBarPagerView)
                    ((TabBarPagerView) viewGroup.getChildAt(i)).scrollToTop();
            }
        }
        if (tabBarItem instanceof ScrollView)
            ((ScrollView) tabBarItem).smoothScrollTo(0, 0);
        if (tabBarItem instanceof NavigationStackView)
            ((NavigationStackView) tabBarItem).scrollToTop();
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

    @Nullable
    @Override
    public Adapter getAdapter() {
        return (Adapter) super.getAdapter();
    }

    int getTabsCount() {
        return getAdapter() != null ? getAdapter().tabFragments.size() : 0;
    }

    TabBarItemView getTabAt(int index) {
        return getAdapter() != null ? getAdapter().tabFragments.get(index).tabBarItem : null;
    }

    void addTab(TabBarItemView tab, int index) {
        if (getAdapter() != null) {
            getAdapter().addTab(tab, index);
            populateTabs();
        }
    }

    void removeTab(int index) {
        if (getAdapter() != null) {
            getAdapter().removeTab(index);
            populateTabs();
        }
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        try {
            if (super.onInterceptTouchEvent(ev)) {
                NativeGestureUtil.notifyNativeGestureStarted(this, ev);
                return true;
            }
        } catch (IllegalArgumentException ignored) {
        }
        return false;
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

    private class Adapter extends FragmentPagerAdapter {
        private List<TabFragment> tabFragments = new ArrayList<>();

        Adapter(FragmentManager fragmentManager) {
            super(fragmentManager, BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT);
        }

        void addTab(TabBarItemView tab, int index) {
            tabFragments.add(index, new TabFragment(tab));
            dataSetChanged = true;
            notifyDataSetChanged();
            dataSetChanged = false;
        }

        void removeTab(int index) {
            tabFragments.remove(index);
            dataSetChanged = true;
            notifyDataSetChanged();
            dataSetChanged = false;
        }

        @Override
        public int getCount() {
            return tabFragments.size();
        }

        @NonNull
        @Override
        public Fragment getItem(int position) {
            return tabFragments.get(position);
        }

        @Nullable
        @Override
        public CharSequence getPageTitle(int position) {
            return tabFragments.get(position).tabBarItem.title;
        }

        @Override
        public int getItemPosition(@NonNull Object object) {
            for(int i = 0; i < tabFragments.size(); i++) {
                if (tabFragments.get(i) == object)
                    return i;
            }
            return POSITION_NONE;
        }

        @Override
        public long getItemId(int position) {
            return tabFragments.get(position).hashCode();
        }
    }

    private class TabChangeListener implements ViewPager.OnPageChangeListener {

        @Override
        public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
        }

        @Override
        public void onPageSelected(int position) {
            if (!dataSetChanged)
                nativeEventCount++;
            selectedTab = position;
            WritableMap event = Arguments.createMap();
            event.putInt("tab", position);
            event.putInt("eventCount", nativeEventCount);
            ReactContext reactContext = (ReactContext) getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onTabSelected", event);
            if (getAdapter() != null)
                getAdapter().tabFragments.get(position).tabBarItem.pressed();
        }

        @Override
        public void onPageScrollStateChanged(int state) {
        }
    }

    public static class TabBarPagerFragment extends Fragment {
        private TabBarPagerView tabBarPager;

        public TabBarPagerFragment() {
            super();
        }

        TabBarPagerFragment(TabBarPagerView tabBarPager) {
            super();
            this.tabBarPager = tabBarPager;
        }

        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            return tabBarPager != null ? tabBarPager : new View(getContext());
        }
    }
}
