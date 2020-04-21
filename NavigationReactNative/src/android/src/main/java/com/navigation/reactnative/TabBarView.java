package com.navigation.reactnative;

import android.content.Context;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.NativeGestureUtil;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.List;

public class TabBarView extends ViewPager {
    boolean swipeable = true;

    public TabBarView(Context context) {
        super(context);
        addOnPageChangeListener(new TabChangeListener());
        setAdapter(new Adapter());
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        requestLayout();
        post(measureAndLayout);
        if (getTabView() != null)
            getTabView().setupWithViewPager(this);
        populateTabs();
    }

    void populateTabs() {
        TabView tabView = getTabView();
        if (tabView != null && getAdapter() != null) {
            for(int i = 0; i < tabView.getTabCount(); i++) {
                getAdapter().tabs.get(i).setTabView(tabView);
            }
        }
    }

    private TabView getTabView() {
        ViewGroup parent = (ViewGroup) getParent();
        if (parent instanceof CoordinatorLayout) {
            parent = (ViewGroup) parent.getChildAt(0);
        }
        for(int i = 0; parent != null && i < parent.getChildCount(); i++) {
            View child = parent.getChildAt(i);
            if (child instanceof TabView)
                return (TabView) child;
        }
        return null;
    }

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
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
        return getAdapter() != null ? getAdapter().tabs.size() : 0;
    }

    TabBarItemView getTabAt(int index) {
        return getAdapter() != null ? getAdapter().tabs.get(index) : null;
    }

    void addTab(TabBarItemView tab, int index) {
        if (getAdapter() != null)
            getAdapter().addTab(tab, index);
    }

    void removeTab(int index) {
        if (getAdapter() != null)
            getAdapter().removeTab(index);
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        try {
            if (swipeable && super.onInterceptTouchEvent(ev)) {
                NativeGestureUtil.notifyNativeGestureStarted(this, ev);
                return true;
            }
        } catch (IllegalArgumentException ignored) {
        }
        return false;
    }

    @Override
    public boolean onTouchEvent(MotionEvent ev) {
        try {
            return swipeable && super.onTouchEvent(ev);
        } catch (IllegalArgumentException ignored) {
        }

        return false;
    }

    private class Adapter extends PagerAdapter {
        private List<TabBarItemView> tabs = new ArrayList<>();

        void addTab(TabBarItemView tab, int index) {
            tabs.add(index, tab);
            notifyDataSetChanged();
        }

        void removeTab(int index) {
            tabs.remove(index);
            notifyDataSetChanged();
        }

        @Override
        public int getCount() {
            return tabs.size();
        }

        @Nullable
        @Override
        public CharSequence getPageTitle(int position) {
            return tabs.get(position).title;
        }

        @Override
        public int getItemPosition(@NonNull Object object) {
            return tabs.indexOf(object);
        }

        @NonNull
        @Override
        public Object instantiateItem(@NonNull ViewGroup container, int position) {
            TabBarItemView tab = tabs.get(position);
            container.addView(tab, 0);
            post(measureAndLayout);
            return tab;
        }

        @Override
        public void destroyItem(@NonNull ViewGroup container, int position, @NonNull Object object) {
            container.removeView((View) object);
        }

        @Override
        public boolean isViewFromObject(@NonNull View view, @NonNull Object object) {
            return view == object;
        }
    }

    private class TabChangeListener implements ViewPager.OnPageChangeListener {

        @Override
        public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
        }

        @Override
        public void onPageSelected(int position) {
            WritableMap event = Arguments.createMap();
            event.putInt("tab", position);
            ReactContext reactContext = (ReactContext) getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onTabSelected", event);
            if (getAdapter() != null)
                getAdapter().tabs.get(position).pressed();
        }

        @Override
        public void onPageScrollStateChanged(int state) {
        }
    }
}
