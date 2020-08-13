package com.navigation.reactnative;

import android.content.Context;
import android.view.ViewGroup;

public class BarButtonView extends ViewGroup {
    String title;
    int showAsAction;
    boolean search;

    public BarButtonView(Context context) {
        super(context);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
