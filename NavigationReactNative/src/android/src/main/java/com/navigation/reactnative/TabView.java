package com.navigation.reactnative;

import android.graphics.drawable.Drawable;

import com.google.android.material.badge.BadgeDrawable;

public interface TabView {
    void setTitle(int index, CharSequence title);

    void setIcon(int index, Drawable icon);

    void setTestID(int index, String testID);

    BadgeDrawable getBadgeIcon(int index);

    void removeBadgeIcon(int index);
}
