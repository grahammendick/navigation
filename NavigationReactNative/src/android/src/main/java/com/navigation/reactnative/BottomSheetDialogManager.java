package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
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

    @ReactProp(name = "peekHeight")
    public void setPeekHeight(BottomSheetDialogView view, int peekHeight) {
        view.getBehavior().setPeekHeight((int) PixelUtil.toPixelFromDIP(peekHeight), true);
    }

    @ReactProp(name = "expandedOffset")
    public void setExpandedOffset(BottomSheetDialogView view, int expandedOffset) {
        int offset = (int) PixelUtil.toPixelFromDIP(expandedOffset);
        view.getBehavior().setExpandedOffset(offset);
        view.sheetView.setExpandedOffset(offset);
        view.sheetView.requestLayout();
        if (view.sheetView.getParent() != null)
            view.sheetView.getParent().requestLayout();
    }

    @ReactProp(name = "fitToContents")
    public void setFitToContents(BottomSheetDialogView view, boolean fitToContents) {
        view.getBehavior().setFitToContents(fitToContents);
    }

    @ReactProp(name = "halfExpandedRatio", defaultFloat = Float.MAX_VALUE)
    public void setHalfExpandedRatio(BottomSheetDialogView view, float halfExpandedRatio) {
        view.getBehavior().setHalfExpandedRatio(halfExpandedRatio != Float.MAX_VALUE ? halfExpandedRatio : view.defaultHalfExpandedRatio);
        view.requestLayout();
    }

    @ReactProp(name = "hideable")
    public void setHideable(BottomSheetDialogView view, boolean hideable) {
        view.getBehavior().setHideable(hideable);
    }

    @ReactProp(name = "skipCollapsed")
    public void setSkipCollapsed(BottomSheetDialogView view, boolean skipCollapsed) {
        view.getBehavior().setSkipCollapsed(skipCollapsed);
    }

    @ReactProp(name = "draggable")
    public void setDraggable(BottomSheetDialogView view, boolean draggable) {
        view.getBehavior().setDraggable(draggable);
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
            .put("topOnDetentChanged", MapBuilder.of("registrationName", "onDetentChanged"))
            .build();
    }

    @Override
    public void addView(BottomSheetDialogView parent, View child, int index) {
        parent.sheetView.addView(child, index);
    }

    @Override
    public void removeViewAt(BottomSheetDialogView parent, int index) {
        parent.sheetView.removeViewAt(index);
    }

    @Override
    public int getChildCount(BottomSheetDialogView parent) {
        return parent.sheetView.getChildCount();
    }

    @Override
    public View getChildAt(BottomSheetDialogView parent, int index) {
        return parent.getChildAt(index);
    }
}
