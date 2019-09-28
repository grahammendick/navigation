package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.viewpager.widget.ViewPager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.tabs.TabLayout;

import java.util.ArrayList;
import java.util.List;

public class TabBarView extends ViewPager {
    private List<TabBarItemView> tabs = new ArrayList<>();

    public TabBarView(Context context) {
        super(context);
        addOnPageChangeListener(new TabChangeListener());
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        Activity activity = ((ReactContext) getContext()).getCurrentActivity();
        setAdapter(new Adapter(getFragmentManager(activity)));
        for(int i = 0; i < tabs.size(); i++) {
            addTab(tabs.get(i), i);
        }
        this.requestLayout();
        post(measureAndLayout);
        ((TabLayout) ((ViewGroup) getParent()).getChildAt(0)).setupWithViewPager(this);
    }

    private FragmentManager getFragmentManager(Activity activity) {
        ViewParent parent = this;
        Fragment fragment = null;
        while (parent != null) {
            if (parent instanceof NavigationBoundary) {
                fragment = ((NavigationBoundary) parent).getFragment();
                break;
            }
            parent = parent.getParent();
        }
        return fragment == null? ((FragmentActivity) activity).getSupportFragmentManager():  fragment.getChildFragmentManager();
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

    void addTab(TabBarItemView tab, int index) {
        if (getAdapter() != null)
            getAdapter().addTab(tab, index);
        else
            tabs.add(index, tab);
    }

    private class Adapter extends FragmentPagerAdapter {
        private List<TabFragment> tabFragments = new ArrayList<>();

        Adapter(FragmentManager fragmentManager) {
            super(fragmentManager);
        }

        void addTab(TabBarItemView tab, int index) {
            tabFragments.add(index, new TabFragment(tab));
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
                tab.setElevation(-1 * index);
            notifyDataSetChanged();
            setOffscreenPageLimit(tabFragments.size() == 1 ? 2 : 1);
        }

        @Override
        public int getCount() {
            return tabFragments.size();
        }

        @Override
        public Fragment getItem(int position) {
            return tabFragments.get(position);
        }

        @Nullable
        @Override
        public CharSequence getPageTitle(int position) {
            return tabFragments.get(position).tabBarItem.title;
        }

        @NonNull
        @Override
        public Object instantiateItem(@NonNull ViewGroup container, int position) {
            post(measureAndLayout);
            return super.instantiateItem(container, position);
        }

        @Override
        public void destroyItem(@NonNull ViewGroup container, int position, @NonNull Object object) {
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
        }

        @Override
        public void onPageScrollStateChanged(int state) {

        }
    }
}
