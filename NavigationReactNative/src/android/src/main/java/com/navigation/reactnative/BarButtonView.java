package com.navigation.reactnative;

import android.content.Context;
import android.view.MenuItem;
import android.view.ViewGroup;

public class BarButtonView extends ViewGroup {
    private String title;
    private int showAsAction;
    private boolean search;
    private MenuItem menuItem;

    public BarButtonView(Context context) {
        super(context);
    }

    boolean getSearch() {
        return search;
    }

    void setTitle(String title) {
        this.title = title;
        if (menuItem != null)
            menuItem.setTitle(title);
    }

    void setShowAsAction(int showAsAction) {
        this.showAsAction = showAsAction;
        if (menuItem != null)
            menuItem.setShowAsAction(!search ? showAsAction : MenuItem.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW | showAsAction);
    }

    void setSearch(boolean search) {
        this.search = search;
        setShowAsAction(showAsAction);
    }

    void setMenuItem(MenuItem menuItem) {
        this.menuItem = menuItem;
        setTitle(title);
        setShowAsAction(showAsAction);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
