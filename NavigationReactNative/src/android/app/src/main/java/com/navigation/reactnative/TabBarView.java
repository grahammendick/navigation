package com.navigation.reactnative;

import android.content.Context;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.viewpager.widget.ViewPager;

import com.facebook.react.uimanager.ThemedReactContext;

import java.util.ArrayList;
import java.util.List;

public class TabBarView extends ViewPager {

    public TabBarView(Context context) {
        super(context);
        setAdapter(new Adapter());
    }

    @Nullable
    @Override
    public Adapter getAdapter() {
        return (Adapter) super.getAdapter();
    }

    void addViewToAdapter(View child, int index) {
        getAdapter().addView(child, index);
    }

    public class Adapter extends FragmentPagerAdapter {

        Adapter() {
            super(((FragmentActivity) ((ThemedReactContext) getContext()).getCurrentActivity()).getSupportFragmentManager());
        }

        private final List<TabFragment> fragments = new ArrayList<>();

        void addView(View child, int index) {
            fragments.add(index, new TabFragment(child));
            notifyDataSetChanged();
        }

        @Override
        public int getCount() {
            return fragments.size();
        }

        @Override
        public Fragment getItem(int position) {
            return fragments.get(position);
        }
    }
}
