package com.navigation.reactnative;

import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.drawerlayout.widget.DrawerLayout;

import com.google.android.material.navigation.NavigationView;

public class DrawerView extends NavigationView {
    public DrawerView(@NonNull Context context) {
        super(context);
        DrawerLayout.LayoutParams params = new DrawerLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        params.gravity = Gravity.LEFT;
        setLayoutParams(params);
    }

    @Override
    public void addView(View child) {
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    }
}
