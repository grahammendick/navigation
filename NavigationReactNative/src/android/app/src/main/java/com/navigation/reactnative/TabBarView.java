package com.navigation.reactnative;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.Nullable;
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;

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

    private class Adapter extends PagerAdapter {

        private final List<View> mViews = new ArrayList<>();
        private boolean mIsViewPagerInIntentionallyInconsistentState = false;

        void addView(View child, int index) {
            mViews.add(index, child);
            notifyDataSetChanged();
        }

        void removeViewAt(int index) {
            mViews.remove(index);
            notifyDataSetChanged();
        }

        /**
         * Replace a set of views to the ViewPager adapter and update the ViewPager
         */
        void setViews(List<View> views) {
            mViews.clear();
            mViews.addAll(views);
            notifyDataSetChanged();

            // we want to make sure we return POSITION_NONE for every view here, since this is only
            // called after a removeAllViewsFromAdapter
            mIsViewPagerInIntentionallyInconsistentState = false;
        }

        @Override
        public int getCount() {
            return mViews.size();
        }

        @Override
        public int getItemPosition(Object object) {
            // if we've removed all views, we want to return POSITION_NONE intentionally
            return mIsViewPagerInIntentionallyInconsistentState || !mViews.contains(object) ?
                    POSITION_NONE : mViews.indexOf(object);
        }

        @Override
        public Object instantiateItem(ViewGroup container, int position) {
            View view = mViews.get(position);
            container.addView(view, 0, generateDefaultLayoutParams());
            //post(measureAndLayout);
            return view;
        }

        @Override
        public boolean isViewFromObject(View view, Object object) {
            return view == object;
        }
    }
}
