package com.navigation.reactnative;

import android.content.Context;
import android.graphics.Color;
import android.view.MenuItem;
import android.view.ViewGroup;

import androidx.appcompat.widget.SearchView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

public class SearchBarView extends ReactViewGroup {
    SearchView searchView;
    int nativeEventCount;
    int mostRecentEventCount;

    public SearchBarView(Context context) {
        super(context);
        searchView = new SearchView(context);
        searchView.setBackgroundColor(Color.WHITE);
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
    }

    void setQuery(String query) {
        int eventLag = nativeEventCount - mostRecentEventCount;
        if (eventLag == 0)
            searchView.setQuery(query, true);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        ViewGroup view = (ViewGroup) getParent();
        NavigationBarView navigationBarView = null;
        for(int i = 0; i < view.getChildCount(); i++) {
            if (view.getChildAt(i) instanceof  NavigationBarView)
                navigationBarView = (NavigationBarView) view.getChildAt(i);
        }
        if (navigationBarView != null) {
            navigationBarView.setOnSearchListener(new NavigationBarView.OnSearchListener() {
                @Override
                public void onSearchAdd(MenuItem searchMenuItem) {
                    searchMenuItem.setActionView(searchView);
                }

                @Override
                public void onSearchExpand() {
                    WritableMap event = Arguments.createMap();
                    event.putBoolean("show", true);
                    ReactContext reactContext = (ReactContext) getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onShow", event);
                }

                @Override
                public void onSearchCollapse() {
                    WritableMap event = Arguments.createMap();
                    event.putBoolean("show", false);
                    ReactContext reactContext = (ReactContext) getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onShow", event);
                }
            });
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
