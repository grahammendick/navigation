package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
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

    @Override
    protected void onAfterUpdateTransaction(@NonNull DialogView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }

    @Override
    public void addView(DialogView parent, View child, int index) {
        parent.dialogRootView.addView(child, index);
    }

    @Override
    public void removeViewAt(DialogView parent, int index) {
        parent.dialogRootView.removeViewAt(index);
    }

    @Override
    public int getChildCount(DialogView parent) {
        return parent.dialogRootView.getChildCount();
    }

    @Override
    public View getChildAt(DialogView parent, int index) {
        return parent.dialogRootView.getChildAt(index);
    }

    @Override
    protected void addEventEmitters(@NonNull ThemedReactContext reactContext, @NonNull DialogView view) {
        super.addEventEmitters(reactContext, view);
        view.dialogRootView.eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, view.getId());
    }
}
