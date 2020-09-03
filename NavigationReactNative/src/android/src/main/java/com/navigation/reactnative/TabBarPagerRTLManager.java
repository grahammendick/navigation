package com.navigation.reactnative;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
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
import com.google.android.material.tabs.TabLayout;
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
                super.onPageSelected(position);
                if (!tabBarPagerAdapter.dataSetChanged)
                    tabBarPagerAdapter.nativeEventCount++;
                tabBarPagerAdapter.selectedTab = position;
                WritableMap event = Arguments.createMap();
                event.putInt("tab", position);
                event.putInt("eventCount", tabBarPagerAdapter.nativeEventCount);
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(tabBarPager.getId(),"onTabSelected", event);
                tabBarPagerAdapter.getTabAt(position).pressed();
            }

            @Override
            public void onPageScrollStateChanged(int state) {
                super.onPageScrollStateChanged(state);
                WritableMap event = Arguments.createMap();
                event.putBoolean("swiping", state == ViewPager2.SCROLL_STATE_DRAGGING);
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(tabBarPager.getId(),"onTabSwipeStateChanged", event);
            }
        });
        tabBarPager.addOnAttachStateChangeListener(new View.OnAttachStateChangeListener() {
            @Override
            public void onViewAttachedToWindow(View v) {
                TabLayoutRTLView tabLayout = getTabLayout(v);
                if (tabLayout != null) {
                    new TabLayoutMediator(tabLayout, tabBarPager,
                            new TabLayoutMediator.TabConfigurationStrategy() {
                                @Override
                                public void onConfigureTab(@NonNull TabLayout.Tab tab, int position) {
                                    tab.setText(tabBarPagerAdapter.getTabAt(position).title);
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
            public void onChanged() {
                super.onChanged();
                if (tabBarPager.getCurrentItem() != tabBarPagerAdapter.selectedTab
                        && tabBarPagerAdapter.getTabsCount() > tabBarPagerAdapter.selectedTab) {
                    setCurrentItem(tabBarPager, tabBarPagerAdapter.selectedTab);
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
        int eventLag = getAdapter(view).nativeEventCount - getAdapter(view).mostRecentEventCount;
        if (eventLag == 0 && view.getCurrentItem() != selectedTab) {
            getAdapter(view).selectedTab = selectedTab;
            if (getAdapter(view).getTabsCount() > selectedTab)
                setCurrentItem(view, selectedTab);
        }
    }

    private void setCurrentItem(final ViewPager2 view, int selectedTab) {
        view.post(new Runnable() {
            @Override
            public void run() {
                view.measure(
                    View.MeasureSpec.makeMeasureSpec(view.getWidth(), View.MeasureSpec.EXACTLY),
                    View.MeasureSpec.makeMeasureSpec(view.getHeight(), View.MeasureSpec.EXACTLY));
                view.layout(view.getLeft(), view.getTop(), view.getRight(), view.getBottom());
            }
        });
        view.setCurrentItem(selectedTab, false);
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(ViewPager2 view, int mostRecentEventCount) {
        getAdapter(view).mostRecentEventCount = mostRecentEventCount;
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
    }

    @Override
    public void removeViewAt(ViewPager2 parent, int index) {
        getAdapter(parent).removeTab(index);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onTabSelected", MapBuilder.of("registrationName", "onTabSelected"))
                .put("onTabSwipeStateChanged", MapBuilder.of("registrationName", "onTabSwipeStateChanged"))
                .build();
    }

    @Override
    protected void onAfterUpdateTransaction(@Nonnull ViewPager2 view) {
        super.onAfterUpdateTransaction(view);
        getAdapter(view).populateTabs(getTabLayout(view));
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

    private TabLayoutRTLView getTabLayout(View view) {
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