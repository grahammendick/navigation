package com.navigation.reactnative;

import android.content.Context;

import androidx.annotation.Nullable;
import androidx.viewpager.widget.ViewPager;

import com.google.android.material.bottomnavigation.BottomNavigationView;

public class TabNavigationView extends BottomNavigationView implements TabView {

    public TabNavigationView(Context context) {
        super(context);
    }

    @Override
    public void setupWithViewPager(@Nullable ViewPager viewPager) {
    }
}
