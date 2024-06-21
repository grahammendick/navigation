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

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topShowChanged", MapBuilder.of("registrationName", "onShowChanged"))
            .build();
    }

    @Override
    public void addView(DialogView parent, View child, int index) {
        parent.dialogRootView = (DialogRootView) child;
    }

    @Override
    public void removeViewAt(DialogView parent, int index) {
        parent.dialogRootView = null;
    }

    @Override
    public int getChildCount(DialogView parent) {
        return parent.dialogRootView != null ? 1 : 0;
    }

    @Override
    public View getChildAt(DialogView parent, int index) {
        return parent.dialogRootView;
    }
}
