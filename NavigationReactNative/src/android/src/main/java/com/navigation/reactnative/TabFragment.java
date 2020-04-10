package com.navigation.reactnative;

import android.os.Build;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ScrollView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class TabFragment extends Fragment {
    TabBarItemView tabBarItem;

    TabFragment(TabBarItemView tabBarItem) {
        super();
        this.tabBarItem = tabBarItem;
        tabBarItem.fragment = this;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        boolean nestedScrollView = false;
        View child = tabBarItem.getChildAt(0);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
            nestedScrollView = child instanceof ScrollView && child.isNestedScrollingEnabled();
        return nestedScrollView ? tabBarItem.getChildAt(0) : tabBarItem;
    }
}
