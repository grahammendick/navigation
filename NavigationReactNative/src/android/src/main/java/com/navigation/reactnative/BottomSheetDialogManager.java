package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

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
