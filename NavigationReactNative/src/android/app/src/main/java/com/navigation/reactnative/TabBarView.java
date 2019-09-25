package com.navigation.reactnative;

import android.content.Context;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.viewpager.widget.ViewPager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.List;

public class TabBarView extends ViewPager {

    public TabBarView(Context context) {
        super(context);
        addOnPageChangeListener(new TabChangeListener());
        setAdapter(new Adapter());
    }

    @Nullable
    @Override
    public Adapter getAdapter() {
        return (Adapter) super.getAdapter();
    }

    void addTab(TabBarItemView tab, int index) {
        getAdapter().addTab(tab, index);
    }

    private class Adapter extends FragmentPagerAdapter {
        private List<TabFragment> tabs = new ArrayList<>();

        Adapter() {
            super(((FragmentActivity) ((ReactContext) getContext()).getCurrentActivity()).getSupportFragmentManager());
        }

        void addTab(TabBarItemView tab, int index) {
            tabs.add(index, new TabFragment(tab));
            notifyDataSetChanged();
        }

        @Override
        public int getCount() {
            return tabs.size();
        }

        @Override
        public Fragment getItem(int position) {
            return tabs.get(position);
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
