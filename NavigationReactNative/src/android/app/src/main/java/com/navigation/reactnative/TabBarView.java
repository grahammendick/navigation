package com.navigation.reactnative;

import android.content.Context;
import android.os.Build;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.fragment.app.FragmentTransaction;
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

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        this.requestLayout();
        post(measureAndLayout);
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
    }

    void removeTab(int index) {
        if (getAdapter() != null)
            getAdapter().removeTab(index);
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

        void removeTab(int index) {
            tabs.remove(index);
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

        @Override
        public int getItemPosition(@NonNull Object object) {
            return tabs.indexOf(object);
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
