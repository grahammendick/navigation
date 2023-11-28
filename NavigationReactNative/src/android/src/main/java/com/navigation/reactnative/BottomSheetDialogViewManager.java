package com.navigation.reactnative;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.NVBottomSheetDialogManagerDelegate;
import com.facebook.react.viewmanagers.NVBottomSheetDialogManagerInterface;

public class BottomSheetDialogViewManager extends ViewGroupManager<BottomSheetDialogView> implements NVBottomSheetDialogManagerInterface<BottomSheetDialogView> {
    private final ViewManagerDelegate<BottomSheetDialogView> delegate;

    public BottomSheetDialogViewManager() {
        delegate = new NVBottomSheetDialogManagerDelegate<>(this);
    }

    @Nullable
    @Override
    public ViewManagerDelegate<BottomSheetDialogView> getDelegate() {
        return delegate;
    }

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
    public void setDetent(BottomSheetDialogView view, @Nullable String value) {

    }

    @Override
    public void setMostRecentEventCount(BottomSheetDialogView view, int value) {

    }

    @Override
    public void setPeekHeight(BottomSheetDialogView view, int value) {

    }

    @Override
    public void setExpandedHeight(BottomSheetDialogView view, int value) {

    }

    @Override
    public void setExpandedOffset(BottomSheetDialogView view, int value) {

    }

    @Override
    public void setFitToContents(BottomSheetDialogView view, boolean value) {

    }

    @Override
    public void setHalfExpandedRatio(BottomSheetDialogView view, float value) {

    }

    @Override
    public void setHideable(BottomSheetDialogView view, boolean value) {

    }

    @Override
    public void setSkipCollapsed(BottomSheetDialogView view, boolean value) {

    }

    @Override
    public void setDraggable(BottomSheetDialogView view, boolean value) {

    }

    @Override
    public void setSheetHeight(BottomSheetDialogView view, double value) {

    }
}
