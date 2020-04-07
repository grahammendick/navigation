package com.navigation.reactnative;

import android.graphics.drawable.Drawable;

import androidx.annotation.Nullable;
import androidx.viewpager.widget.ViewPager;

import com.google.android.material.badge.BadgeDrawable;

public interface TabView {
    void setupWithViewPager(@Nullable ViewPager viewPager);

    int getTabCount();

    void setIcon(int index, Drawable icon);

    BadgeDrawable getBadgeIcon(int index);

    void removeBadgeIcon(int index);

    Runnable getMeasureAndLayout();
}
