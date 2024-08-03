package com.navigation.reactnative;

import android.view.Gravity;

import androidx.annotation.NonNull;
import androidx.drawerlayout.widget.DrawerLayout;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class DrawerManager extends ViewGroupManager<DrawerView> {
    @NonNull
    @Override
    public String getName() {
        return "NVDrawer";
    }

    @ReactProp(name = "fromRight")
    public void setFromRight(DrawerView view, boolean fromRight) {
        ((DrawerLayout.LayoutParams) view.getLayoutParams()).gravity = !fromRight ? Gravity.LEFT : Gravity.RIGHT;
    }

    @NonNull
    @Override
    protected DrawerView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new DrawerView(themedReactContext);
    }
}
