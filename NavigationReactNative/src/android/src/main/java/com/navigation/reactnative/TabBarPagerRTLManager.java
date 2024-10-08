package com.navigation.reactnative;

import static android.view.View.LAYOUT_DIRECTION_RTL;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
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
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.tabs.TabLayoutMediator;

import java.util.Map;

import javax.annotation.Nonnull;

public class TabBarPagerRTLManager extends ViewGroupManager<ViewPager2> {

    @Nonnull
    @Override
    public String getName() {
        return "NVTabBarPagerRTL";
    }

    @Nonnull
    @Override
    protected ViewPager2 createViewInstance(@Nonnull final ThemedReactContext reactContext) {
        final ViewPager2 tabBarPager = new ViewPager2(reactContext);
        tabBarPager.setLayoutDirection(LAYOUT_DIRECTION_RTL);
        FragmentActivity activity = (FragmentActivity) reactContext.getCurrentActivity();
        Fragment fragment = new TabBarPagerFragment(tabBarPager);
        if (activity != null) {
            FragmentTransaction transaction = activity.getSupportFragmentManager().beginTransaction();
            transaction.add(fragment, "TabBarPager" + tabBarPager.getId());
            transaction.commitNowAllowingStateLoss();
        }
        final TabBarPagerRTLAdapter tabBarPagerAdapter = new TabBarPagerRTLAdapter(fragment);
        tabBarPager.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        tabBarPager.setAdapter(tabBarPagerAdapter);
        tabBarPager.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                if (position == -1) return;
                super.onPageSelected(position);
                tabBarPagerAdapter.selectedTab = position;
                tabBarPagerAdapter.selectTab(tabBarPager, position);
            }

            @Override
            public void onPageScrollStateChanged(int state) {
                super.onPageScrollStateChanged(state);
                WritableMap event = Arguments.createMap();
                event.putBoolean("swiping", state == ViewPager2.SCROLL_STATE_DRAGGING);
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(tabBarPager.getId(),"topTabSwipeStateChanged", event);
            }
        });
        tabBarPager.addOnAttachStateChangeListener(new View.OnAttachStateChangeListener() {
            @Override
            public void onViewAttachedToWindow(@NonNull View v) {
                TabLayoutRTLView tabLayout = tabBarPagerAdapter.getTabLayout(v);
                if (tabLayout != null) {
                    tabLayout.setVisibility(View.VISIBLE);
                    new TabLayoutMediator(tabLayout, tabBarPager,
                        (tab, position) -> tab.setText(tabBarPagerAdapter.getTabAt(position).styledTitle)
                    ).attach();
                    tabBarPagerAdapter.populateTabs(tabLayout);
                }
            }

            @Override
            public void onViewDetachedFromWindow(@NonNull View v) {
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

    @ReactProp(name = "preventFouc")
    public void setPreventFouc(ViewPager2 view, boolean preventFouc) {
        if (preventFouc && !getAdapter(view).preventFouc)
            getAdapter(view).foucCounter++;
        getAdapter(view).preventFouc = preventFouc;
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(ViewPager2 view, int mostRecentEventCount) {
        getAdapter(view).mostRecentEventCount = mostRecentEventCount;
        getAdapter(view).nativeEventCount = Math.max(getAdapter(view).nativeEventCount, getAdapter(view).mostRecentEventCount);
    }

    @ReactProp(name = "tabCount")
    public void setImages(ViewPager2 view, int tabCount) {
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
            .put("topTabSelected", MapBuilder.of("registrationName", "onTabSelected"))
            .put("topTabSwipeStateChanged", MapBuilder.of("registrationName", "onTabSwipeStateChanged"))
            .build();
    }

    @Override
    protected void onAfterUpdateTransaction(@Nonnull ViewPager2 view) {
        super.onAfterUpdateTransaction(view);
        getAdapter(view).jsUpdate = true;
        getAdapter(view).onAfterUpdateTransaction(view);
        getAdapter(view).jsUpdate = false;
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
}
