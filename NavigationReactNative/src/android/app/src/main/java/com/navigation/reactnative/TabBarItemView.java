package com.navigation.reactnative;

import android.content.Context;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;

public class TabBarItemView extends ViewGroup implements NavigationBoundary {
    Fragment fragment;
    protected String title;

    public TabBarItemView(Context context) {
        super(context);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    public Fragment getFragment() {
        return fragment;
    }
}
