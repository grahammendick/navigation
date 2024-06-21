package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class SheetManager extends ViewGroupManager<SheetView> {
    @NonNull
    @Override
    public String getName() {
        return "NVSheet";
    }

    @NonNull
    @Override
    protected SheetView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new SheetView(themedReactContext);
    }

    @ReactProp(name = "show")
    public void setShow(SheetView view, boolean show) {
        view.show = show;
    }

    @ReactProp(name = "stackId")
    public void setStackId(SheetView view, String stackId) {
        view.stackId = stackId;
    }

    @ReactProp(name = "crumb")
    public void setCrumb(SheetView view, int crumb) {
        view.crumb = crumb;
    }

    @ReactProp(name = "ancestorStackIds")
    public void setAncestorStackIds(SheetView view, ReadableArray ancestorStackIds) {
        view.ancestorStackIds = ancestorStackIds;
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull SheetView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }

    @Override
    public void addView(SheetView parent, View child, int index) {
        parent.container = child;
        parent.onAfterUpdateTransaction();
    }

    @Override
    public void removeViewAt(SheetView parent, int index) {
        parent.container = null;
    }

    @Override
    public int getChildCount(SheetView parent) {
        return parent.container != null ? 1 : 0;
    }

    @Override
    public View getChildAt(SheetView parent, int index) {
        return parent.container;
    }
}
