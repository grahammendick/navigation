package com.navigation.reactnative;

import static com.google.android.material.bottomsheet.BottomSheetBehavior.PEEK_HEIGHT_AUTO;

import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class BottomSheetDialogManager extends ViewGroupManager<BottomSheetDialogView> {
    @NonNull
    @Override
    public String getName() {
        return "NVBottomSheetDialog";
    }

    @NonNull
    @Override
    protected BottomSheetDialogView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new BottomSheetDialogView(themedReactContext);
    }

    @ReactProp(name = "detent")
    public void setDetent(BottomSheetDialogView view, String detent) {
        view.pendingDetent = Integer.parseInt(detent);
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(BottomSheetDialogView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
    }

    @ReactProp(name = "stackId")
    public void setStackId(BottomSheetDialogView view, String stackId) {
        view.stackId = stackId;
    }

    @ReactProp(name = "ancestorStackIds")
    public void setAncestorStackIds(BottomSheetDialogView view, ReadableArray ancestorStackIds) {
        view.ancestorStackIds = ancestorStackIds;
    }

    @ReactProp(name = "peekHeight")
    public void setPeekHeight(BottomSheetDialogView view, int peekHeight) {
        view.bottomSheetBehavior.setPeekHeight(peekHeight != 0 ? (int) PixelUtil.toPixelFromDIP(peekHeight) : PEEK_HEIGHT_AUTO, true);
    }

    @ReactProp(name = "fitToContents")
    public void setFitToContents(BottomSheetDialogView view, boolean fitToContents) {
        view.bottomSheetBehavior.setFitToContents(fitToContents);
    }

    @ReactProp(name = "halfExpandedRatio", defaultFloat = Float.MAX_VALUE)
    public void setHalfExpandedRatio(BottomSheetDialogView view, float halfExpandedRatio) {
        view.bottomSheetBehavior.setHalfExpandedRatio(halfExpandedRatio != Float.MAX_VALUE ? halfExpandedRatio : view.defaultHalfExpandedRatio);
        view.requestLayout();
    }

    @ReactProp(name = "hideable")
    public void setHideable(BottomSheetDialogView view, boolean hideable) {
        view.bottomSheetBehavior.setHideable(hideable);
    }

    @ReactProp(name = "skipCollapsed")
    public void setSkipCollapsed(BottomSheetDialogView view, boolean skipCollapsed) {
        view.bottomSheetBehavior.setSkipCollapsed(skipCollapsed);
    }

    @ReactProp(name = "draggable")
    public void setDraggable(BottomSheetDialogView view, boolean draggable) {
        view.bottomSheetBehavior.setDraggable(draggable);
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull BottomSheetDialogView view) {
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
    public void addView(BottomSheetDialogView parent, View child, int index) {
        parent.sheetView = (DialogRootView) child;
        parent.onAfterUpdateTransaction();
    }

    @Override
    public void removeViewAt(BottomSheetDialogView parent, int index) {
    }

    @Override
    public int getChildCount(BottomSheetDialogView parent) {
        return 1;
    }

    @Override
    public View getChildAt(BottomSheetDialogView parent, int index) {
        return parent.sheetView;
    }
}
