package com.navigation.reactnative;

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

    @ReactProp(name = "ancestorStackIds")
    public void setAncestorStackIds(SheetView view, ReadableArray ancestorStackIds) {
        view.ancestorStackIds = ancestorStackIds;
    }
}
