package com.navigation.reactnative;

import android.view.MenuItem;
import android.view.View;
import android.widget.ImageButton;

public interface ActionView {
    View getChildAt(int index);
    void setCollapseButton(ImageButton collapseButton);
    void setOnSearchListener(OnSearchListener onSearchListener);

    interface OnSearchListener {
        void onSearchAdd(MenuItem searchMenuItem);
        void onSearchExpand();
        void onSearchCollapse();
    }
}
