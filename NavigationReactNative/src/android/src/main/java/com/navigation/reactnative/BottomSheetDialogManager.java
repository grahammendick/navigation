package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

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
