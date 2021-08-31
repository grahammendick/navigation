package com.navigation.reactnative;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.bottomsheet.BottomSheetBehavior;

public class BottomSheetView extends ViewGroup {
    BottomSheetBehavior<BottomSheetView> bottomSheetBehavior = new BottomSheetBehavior<>();
    BottomSheetBehavior.BottomSheetCallback bottomSheetCallback;
    int nativeEventCount;
    int mostRecentEventCount;

    public BottomSheetView(Context context) {
        super(context);
        CoordinatorLayout.LayoutParams params = new CoordinatorLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
        params.setBehavior(bottomSheetBehavior);
        setLayoutParams(params);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (bottomSheetCallback != null)
            bottomSheetBehavior.removeBottomSheetCallback(bottomSheetCallback);
        bottomSheetCallback = new BottomSheetBehavior.BottomSheetCallback() {
            @Override
            public void onStateChanged(@NonNull View view, int i) {
                if (i == BottomSheetBehavior.STATE_HIDDEN
                    || i == BottomSheetBehavior.STATE_COLLAPSED
                    || i == BottomSheetBehavior.STATE_HALF_EXPANDED
                    || i == BottomSheetBehavior.STATE_EXPANDED) {
                    nativeEventCount++;
                    WritableMap event = Arguments.createMap();
                    event.putInt("detent", i);
                    event.putInt("eventCount", nativeEventCount);
                    ReactContext reactContext = (ReactContext) getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "onDetentChanged", event);
                }
            }

            @Override
            public void onSlide(@NonNull View view, float v) {

            }
        };
        bottomSheetBehavior.addBottomSheetCallback(bottomSheetCallback);
    }

    @Override
    protected void onLayout(boolean b, int i, int i1, int i2, int i3) {
    }
}
