package com.navigation.reactnative;

import android.view.Gravity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.drawerlayout.widget.DrawerLayout;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.NVDrawerManagerDelegate;
import com.facebook.react.viewmanagers.NVDrawerManagerInterface;

public class DrawerViewManager extends ViewGroupManager<DrawerView> implements NVDrawerManagerInterface<DrawerView> {
    private final ViewManagerDelegate<DrawerView> delegate;

    public DrawerViewManager() {
        delegate = new NVDrawerManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<DrawerView> getDelegate() {
        return delegate;
    }

    @NonNull
    @Override
    public String getName() {
        return "NVDrawer";
    }

    @NonNull
    @Override
    protected DrawerView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new DrawerView(themedReactContext);
    }

    @Override
    public void setFromRight(DrawerView view, boolean fromRight) {
        ((DrawerLayout.LayoutParams) view.getLayoutParams()).gravity = !fromRight ? Gravity.LEFT : Gravity.RIGHT;
    }
}
