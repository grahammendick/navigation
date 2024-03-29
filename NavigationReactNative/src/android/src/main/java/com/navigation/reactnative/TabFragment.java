package com.navigation.reactnative;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class TabFragment extends Fragment {
    TabBarItemView tabBarItem;
    View view;

    public TabFragment() {
        super();
    }

    TabFragment(TabBarItemView tabBarItem) {
        super();
        this.tabBarItem = tabBarItem;
        view = tabBarItem.content.get(0);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return view != null ? view : new View(getContext());
    }

    boolean viewChanged() {
        return tabBarItem.content.size() > 0 && view != tabBarItem.content.get(0);
    }
}

