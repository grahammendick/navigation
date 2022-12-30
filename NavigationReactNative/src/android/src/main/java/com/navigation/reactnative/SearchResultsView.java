package com.navigation.reactnative;

import android.content.Context;
import android.view.ViewGroup;

import com.google.android.material.search.SearchView;

public class SearchResultsView extends SearchView {

    public SearchResultsView(Context context) {
        super(context);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        ViewGroup view = (ViewGroup) getParent();
        for(int i = 0; i < view.getChildCount(); i++) {
            if (view.getChildAt(i) instanceof NavigationBarView) {
                setupWithSearchBar((SearchToolbarView) ((NavigationBarView) view.getChildAt(i)).getChildAt(0));
            }
        }
    }
}
