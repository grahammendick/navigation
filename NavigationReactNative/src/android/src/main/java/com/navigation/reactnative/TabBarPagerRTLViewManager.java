package com.navigation.reactnative;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.ViewCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.viewmanagers.NVTabBarPagerRTLManagerDelegate;
import com.facebook.react.viewmanagers.NVTabBarPagerRTLManagerInterface;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;

import java.util.Map;

import javax.annotation.Nonnull;

public class TabBarPagerRTLViewManager extends ViewGroupManager<ViewPager2> implements NVTabBarPagerRTLManagerInterface<ViewPager2> {
    private final ViewManagerDelegate<ViewPager2> delegate;

    public TabBarPagerRTLViewManager() {
        delegate = new NVTabBarPagerRTLManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<ViewPager2> getDelegate() {
        return delegate;
    }

    @Nonnull
    @Override
    public String getName() {
        return "NVTabBarPagerRTL";
    }

    @Nonnull
    @Override
    protected ViewPager2 createViewInstance(@Nonnull final ThemedReactContext reactContext) {
        final ViewPager2 tabBarPager = new ViewPager2(reactContext);
        ViewCompat.setLayoutDirection(tabBarPager, ViewCompat.LAYOUT_DIRECTION_RTL);
        FragmentActivity activity = (FragmentActivity) reactContext.getCurrentActivity();
        Fragment fragment = new TabBarPagerFragment(tabBarPager);
        if (activity != null) {
            FragmentTransaction transaction = activity.getSupportFragmentManager().beginTransaction();
            transaction.add(fragment, "TabBarPager" + tabBarPager.getId());
            transaction.commitNowAllowingStateLoss();
        }
        final TabBarPagerRTLAdapter tabBarPagerAdapter = new TabBarPagerRTLAdapter(fragment);
        tabBarPager.setAdapter(tabBarPagerAdapter);
        tabBarPager.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                if (position == -1) return;
                super.onPageSelected(position);
                if (!tabBarPagerAdapter.dataSetChanged)
                    tabBarPagerAdapter.nativeEventCount++;
                tabBarPagerAdapter.selectedTab = position;
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, tabBarPager.getId());
                eventDispatcher.dispatchEvent(new TabBarPagerRTLViewManager.TabSelectedEvent(tabBarPager.getId(), position, tabBarPagerAdapter.nativeEventCount));
                if (tabBarPagerAdapter.getTabAt(position) != null)
                    tabBarPagerAdapter.getTabAt(position).pressed();
            }

            @Override
            public void onPageScrollStateChanged(int state) {
                super.onPageScrollStateChanged(state);
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, tabBarPager.getId());
                eventDispatcher.dispatchEvent(new TabBarPagerRTLViewManager.TabSwipeStateChangedEvent(tabBarPager.getId(), state == ViewPager2.SCROLL_STATE_DRAGGING));
            }
        });
        tabBarPager.addOnAttachStateChangeListener(new View.OnAttachStateChangeListener() {
            @Override
            public void onViewAttachedToWindow(View v) {
                TabLayoutRTLView tabLayout = tabBarPagerAdapter.getTabLayout(v);
                if (tabLayout != null) {
                    tabLayout.setVisibility(View.VISIBLE);
                    new TabLayoutMediator(tabLayout, tabBarPager,
                        new TabLayoutMediator.TabConfigurationStrategy() {
                            @Override
                            public void onConfigureTab(@NonNull TabLayout.Tab tab, int position) {
                                tab.setText(tabBarPagerAdapter.getTabAt(position).styledTitle);
                            }
                        }
                    ).attach();
                    tabBarPagerAdapter.populateTabs(tabLayout);
                }
            }

            @Override
            public void onViewDetachedFromWindow(View v) {
            }
        });
        tabBarPagerAdapter.registerAdapterDataObserver(new RecyclerView.AdapterDataObserver() {
            @Override
            public void onItemRangeInserted(int positionStart, int itemCount) {
                super.onItemRangeInserted(positionStart, itemCount);
                if (tabBarPager.getCurrentItem() != tabBarPagerAdapter.selectedTab
                        && tabBarPagerAdapter.getTabsCount() > tabBarPagerAdapter.selectedTab) {
                    tabBarPagerAdapter.setCurrentItem(tabBarPager, tabBarPagerAdapter.selectedTab);
                }
            }
        });
        return tabBarPager;
    }

    static TabBarPagerRTLAdapter getAdapter(ViewPager2 view) {
        return (TabBarPagerRTLAdapter) view.getAdapter();
    }

    @ReactProp(name = "selectedTab")
    public void setSelectedTab(ViewPager2 view, int selectedTab) {
        getAdapter(view).pendingSelectedTab = selectedTab;
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(ViewPager2 view, int mostRecentEventCount) {
        getAdapter(view).mostRecentEventCount = mostRecentEventCount;
        getAdapter(view).nativeEventCount = Math.max(getAdapter(view).nativeEventCount, getAdapter(view).mostRecentEventCount);
    }

    @Override
    @ReactProp(name = "tabCount")
    public void setTabCount(ViewPager2 view, int tabCount) {
    }

    @ReactProp(name = "scrollsToTop")
    public void setScrollsToTop(ViewPager2 view, boolean scrollsToTop) {
        getAdapter(view).scrollsToTop = scrollsToTop;
    }

    @Override
    public int getChildCount(ViewPager2 parent) {
        return getAdapter(parent).getTabsCount();
    }

    @Override
    public View getChildAt(ViewPager2 parent, int index) {
        return getAdapter(parent).getTabAt(index);
    }

    @Override
    public void addView(ViewPager2 parent, View child, int index) {
        getAdapter(parent).addTab((TabBarItemView) child, index);
        getAdapter(parent).requestOnAfterUpdateTransaction(parent);
    }

    @Override
    public void removeViewAt(ViewPager2 parent, int index) {
        getAdapter(parent).removeTab(index);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topOnTabSelected", MapBuilder.of("registrationName", "onTabSelected"))
            .put("topOnTabSwipeStateChanged", MapBuilder.of("registrationName", "onTabSwipeStateChanged"))
            .build();
    }

    @Override
    protected void onAfterUpdateTransaction(@Nonnull ViewPager2 view) {
        super.onAfterUpdateTransaction(view);
        getAdapter(view).onAfterUpdateTransaction(view);
    }

    @Override
    public void onDropViewInstance(@NonNull ViewPager2 view) {
        FragmentActivity activity = (FragmentActivity) ((ReactContext) view.getContext()).getCurrentActivity();
        Fragment fragment = getAdapter(view).fragment;
        if (activity != null && fragment != null) {
            FragmentManager fragmentManager = activity.getSupportFragmentManager();
            FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
            fragmentTransaction.remove(fragment);
            fragmentTransaction.commitAllowingStateLoss();
        }
        super.onDropViewInstance(view);
    }

    public static class TabBarPagerFragment extends Fragment {
        private ViewPager2 tabBarPager;

        public TabBarPagerFragment() {
            super();
        }

        TabBarPagerFragment(ViewPager2 tabBarPager) {
            super();
            this.tabBarPager = tabBarPager;
        }

        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            return tabBarPager != null ? tabBarPager : new View(getContext());
        }
    }

    static class TabSelectedEvent extends Event<TabBarPagerRTLViewManager.TabSelectedEvent> {
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

    static class TabSwipeStateChangedEvent extends Event<TabBarPagerRTLViewManager.TabSwipeStateChangedEvent> {
        private final boolean swiping;

        public TabSwipeStateChangedEvent(int viewId, boolean swiping) {
            super(viewId);
            this.swiping = swiping;
        }

        @Override
        public String getEventName() {
            return "topOnTabSwipeStateChanged";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putBoolean("swiping", this.swiping);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }
}
