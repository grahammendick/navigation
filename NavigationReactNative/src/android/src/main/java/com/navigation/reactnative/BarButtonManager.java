package com.navigation.reactnative;

import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class BarButtonManager extends ViewGroupManager<BarButtonView> {
    @NonNull
    @Override
    public String getName() {
        return "NVBarButton";
    }

    @NonNull
    @Override
    protected BarButtonView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new BarButtonView(reactContext);
    }

    @ReactProp(name = "title")
    public void setTitle(BarButtonView view, @Nullable String title) {
        view.setTitle(title);
    }

    @ReactProp(name = "show")
    public void setShow(BarButtonView view, @Nullable Integer showAsAction) {
        view.setShowAsAction(showAsAction != null ? showAsAction : MenuItem.SHOW_AS_ACTION_NEVER);
    }

    @ReactProp(name = "search")
    public void setSearch(BarButtonView view, @Nullable Boolean search) {
        view.setSearch(search != null ? search : false);
    }
}
