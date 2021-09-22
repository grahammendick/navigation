package com.navigation.reactnative;

import android.content.Context;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.ImageButton;

import androidx.appcompat.widget.SearchView;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.material.appbar.AppBarLayout;

public class SearchBarView extends ReactViewGroup {
    final SearchView searchView;
    int nativeEventCount;
    int mostRecentEventCount;

    public SearchBarView(Context context) {
        super(context);
        searchView = new SearchView(context);
        CoordinatorLayout.LayoutParams params = new CoordinatorLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
        AppBarLayout.ScrollingViewBehavior behavior = new AppBarLayout.ScrollingViewBehavior();
        params.setBehavior(behavior);
        setLayoutParams(params);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                nativeEventCount++;
                WritableMap event = Arguments.createMap();
                event.putString("text", newText);
                event.putInt("eventCount", nativeEventCount);
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onChangeText", event);
                return false;
            }
        });
        searchView.setOnQueryTextFocusChangeListener(new OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    ToolbarView toolbarView = (ToolbarView) searchView.getParent();
                    if (toolbarView.getChildAt(1) instanceof ImageButton)
                        toolbarView.setCollapseButton((ImageButton) toolbarView.getChildAt(1));
                }
            }
        });
    }

    void setQuery(String query) {
        int eventLag = nativeEventCount - mostRecentEventCount;
        if (eventLag == 0 && !searchView.getQuery().toString().equals(query))
            searchView.setQuery(query, true);
    }

    void setBarTintColor(Integer barTintColor) {
        SearchView.SearchAutoComplete searchAutoComplete = searchView.findViewById(androidx.appcompat.R.id.search_src_text);
        if (barTintColor != null) {
            searchAutoComplete.setBackgroundColor(barTintColor);
        } else {
            searchAutoComplete.setBackground(null);
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (searchView.requestFocusFromTouch()) {
            InputMethodManager inputMethodManager = (InputMethodManager) getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
            if (inputMethodManager != null)
                inputMethodManager.showSoftInput(searchView.findFocus(), 0);
        }
        ToolbarView toolbarView = null;
        ViewGroup view = (ViewGroup) getParent();
        for(int i = 0; i < view.getChildCount(); i++) {
            if (view.getChildAt(i) instanceof NavigationBarView) {
                NavigationBarView navigationBarView = (NavigationBarView) view.getChildAt(i);
                for (int j = 0; j < navigationBarView.getChildCount(); j++) {
                    if (navigationBarView.getChildAt(j) instanceof ToolbarView)
                        toolbarView = (ToolbarView) navigationBarView.getChildAt(i);
                }
            }
        }
        if (toolbarView != null) {
            toolbarView.setOnSearchListener(new ToolbarView.OnSearchListener() {
                @Override
                public void onSearchAdd(MenuItem searchMenuItem) {
                    searchMenuItem.setActionView(searchView);
                }

                @Override
                public void onSearchExpand() {
                    setZ(58);
                    ReactContext reactContext = (ReactContext) getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onExpand", null);
                }

                @Override
                public void onSearchCollapse() {
                    setZ(-58);
                    ReactContext reactContext = (ReactContext) getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onCollapse", null);
                }
            });
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
