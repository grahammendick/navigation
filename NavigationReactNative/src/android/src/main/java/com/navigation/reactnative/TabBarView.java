package com.navigation.reactnative;

import android.content.Context;
import android.view.ViewGroup;

import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentTransaction;

import com.facebook.react.bridge.ReactContext;

import java.util.ArrayList;
import java.util.List;

public class TabBarView extends ViewGroup {
    List<TabFragment> tabFragments = new ArrayList<>();

    public TabBarView(Context context) {
        super(context);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        FragmentActivity activity = (FragmentActivity) ((ReactContext) getContext()).getCurrentActivity();
        FragmentTransaction transaction = activity.getSupportFragmentManager().beginTransaction();
        transaction.add(getId(), tabFragments.get(0));
        transaction.commit();
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
