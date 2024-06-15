package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class DialogManager extends ViewGroupManager<DialogView> {
    @NonNull
    @Override
    public String getName() {
        return "NVDialog";
    }

    @NonNull
    @Override
    protected DialogView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new DialogView(themedReactContext);
    }

    @ReactProp(name = "show")
    public void setShow(DialogView view, boolean show) {
        view.show = show;
    }

    @ReactProp(name = "stackId")
    public void setStackId(DialogView view, String stackId) {
        view.stackId = stackId;
    }

    @ReactProp(name = "ancestorStackIds")
    public void setAncestorStackIds(DialogView view, ReadableArray ancestorStackIds) {
        view.ancestorStackIds = ancestorStackIds;
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull DialogView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }
}
