package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class BottomSheetManager extends ViewGroupManager<BottomSheetView> {
    @NonNull
    @Override
    public String getName() {
        return "NVBottomSheet";
    }

    @NonNull
    @Override
    protected BottomSheetView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new BottomSheetView(reactContext);
    }

    @ReactProp(name = "peekHeight")
    public void setPeekHeight(BottomSheetView view, int peekHeight) {
        view.setPeekHeight((int) PixelUtil.toPixelFromDIP(peekHeight));
    }

    @ReactProp(name = "expandedOffset")
    public void setExpandedOffset(BottomSheetView view, int expandedOffset) {
        view.setExpandedOffset((int) PixelUtil.toPixelFromDIP(expandedOffset));
    }

    @ReactProp(name = "fitToContents")
    public void setFitToContents(BottomSheetView view, boolean fitToContents) {
        view.setFitToContents(fitToContents);
    }

    @ReactProp(name = "height")
    public void setHeight(BottomSheetView view, double height) {
        view.getLayoutParams().height = (int) PixelUtil.toPixelFromDIP(height);
    }
}
