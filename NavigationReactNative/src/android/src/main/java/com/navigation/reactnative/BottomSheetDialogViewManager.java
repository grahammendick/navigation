package com.navigation.reactnative;

import static com.google.android.material.bottomsheet.BottomSheetBehavior.PEEK_HEIGHT_AUTO;

import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ReactStylesDiffMap;
import com.facebook.react.uimanager.StateWrapper;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVBottomSheetDialogManagerDelegate;
import com.facebook.react.viewmanagers.NVBottomSheetDialogManagerInterface;

import java.util.Map;

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

    @ReactProp(name = "detent")
    public void setDetent(BottomSheetDialogView view, @Nullable String detent) {
        view.pendingDetent = Integer.parseInt(detent);
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(BottomSheetDialogView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
    }

    @ReactProp(name = "peekHeight")
    public void setPeekHeight(BottomSheetDialogView view, int peekHeight) {
        view.bottomSheetBehavior.setPeekHeight(peekHeight != 0 ? (int) PixelUtil.toPixelFromDIP(peekHeight) : PEEK_HEIGHT_AUTO, true);
    }

    @Override
    public void setExpandedHeight(BottomSheetDialogView view, int value) {

    }

    @ReactProp(name = "expandedOffset")
    public void setExpandedOffset(BottomSheetDialogView view, int expandedOffset) {
        int offset = (int) PixelUtil.toPixelFromDIP(expandedOffset);
        view.bottomSheetBehavior.setExpandedOffset(offset);
        view.sheetView.setExpandedOffset(offset);
        view.sheetView.requestLayout();
        if (view.sheetView.getParent() != null)
            view.sheetView.getParent().requestLayout();
    }

    @ReactProp(name = "fitToContents")
    public void setFitToContents(BottomSheetDialogView view, boolean fitToContents) {
        view.bottomSheetBehavior.setFitToContents(fitToContents);
    }

    @ReactProp(name = "halfExpandedRatio")
    public void setHalfExpandedRatio(BottomSheetDialogView view, float halfExpandedRatio) {
        view.bottomSheetBehavior.setHalfExpandedRatio(halfExpandedRatio != -1 ? halfExpandedRatio : view.defaultHalfExpandedRatio);
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

    @ReactProp(name = "sheetHeight")
    public void setSheetHeight(BottomSheetDialogView view, double sheetHeight) {
        view.sheetView.setExpandedHeight(sheetHeight != 0 ? (int) PixelUtil.toPixelFromDIP(sheetHeight) : ViewGroup.LayoutParams.WRAP_CONTENT);
        view.sheetView.requestLayout();
        if (view.sheetView.getParent() != null)
            view.sheetView.getParent().requestLayout();
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
        return parent.sheetView.getChildAt(index);
    }

    @Override
    protected void addEventEmitters(@NonNull ThemedReactContext reactContext, @NonNull BottomSheetDialogView view) {
        super.addEventEmitters(reactContext, view);
        view.sheetView.eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, view.getId());
    }

    @Nullable
    @Override
    public Object updateState(@NonNull BottomSheetDialogView view, ReactStylesDiffMap props, StateWrapper stateWrapper) {
        view.setStateWrapper(stateWrapper);
        return null;
    }
}
