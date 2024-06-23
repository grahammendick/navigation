package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

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

    @ReactProp(name = "detent")
    public void setDetent(DialogView view, String detent) {
        view.pendingDetent = Integer.parseInt(detent);
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(DialogView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
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

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topDetentChanged", MapBuilder.of("registrationName", "onDetentChanged"))
            .put("topDismissed", MapBuilder.of("registrationName", "onDismissed"))
            .build();
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
