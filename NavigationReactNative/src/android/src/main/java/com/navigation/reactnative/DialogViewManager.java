package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ReactStylesDiffMap;
import com.facebook.react.uimanager.StateWrapper;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.NVDialogManagerDelegate;
import com.facebook.react.viewmanagers.NVDialogManagerInterface;

import java.util.Map;

public class DialogViewManager extends ViewGroupManager<DialogView> implements NVDialogManagerInterface<DialogView> {
    private final ViewManagerDelegate<DialogView> delegate;

    public DialogViewManager() {
        delegate = new NVDialogManagerDelegate<>(this);
    }

    @Nullable
    @Override
    public ViewManagerDelegate<DialogView> getDelegate() {
        return delegate;
    }

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

    @Override
    public void setDetent(DialogView view, @Nullable String detent) {
        view.pendingDetent = Integer.parseInt(detent);
    }

    @Override
    public void setStackId(DialogView view, @Nullable String stackId) {
        view.stackId = stackId;
    }

    @Override
    public void setAncestorStackIds(DialogView view, @Nullable ReadableArray ancestorStackIds) {
        view.ancestorStackIds = ancestorStackIds;
    }

    @Override
    public void setMostRecentEventCount(DialogView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
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

    @Nullable
    @Override
    public Object updateState(@NonNull DialogView view, ReactStylesDiffMap props, StateWrapper stateWrapper) {
        view.setStateWrapper(stateWrapper);
        return null;
    }
}
