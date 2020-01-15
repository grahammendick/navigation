package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.view.ViewOutlineProvider;

import com.google.android.material.appbar.AppBarLayout;

public class NavigationBarView extends AppBarLayout {
    ViewOutlineProvider defaultOutlineProvider;
    Drawable defaultBackground;

    public NavigationBarView(Context context) {
        super(context);
        setLayoutParams(new AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT));

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            defaultOutlineProvider = getOutlineProvider();
        }
        defaultBackground = getBackground();
    }
}
