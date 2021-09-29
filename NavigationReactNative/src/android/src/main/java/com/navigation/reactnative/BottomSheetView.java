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
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.material.bottomsheet.BottomSheetBehavior;

public class BottomSheetView extends ReactViewGroup {
    BottomSheetBehavior<BottomSheetView> bottomSheetBehavior;
    BottomSheetBehavior.BottomSheetCallback bottomSheetCallback;
    float defaultHalfExpandedRatio;
    int nativeEventCount;
    int mostRecentEventCount;

    public BottomSheetView(Context context) {
        super(context);
        bottomSheetBehavior = new BottomSheetBehavior<>(context, null);
        CoordinatorLayout.LayoutParams params = new CoordinatorLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
        params.setBehavior(bottomSheetBehavior);
        setLayoutParams(params);
        defaultHalfExpandedRatio = bottomSheetBehavior.getHalfExpandedRatio();
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (bottomSheetCallback != null)
            bottomSheetBehavior.removeBottomSheetCallback(bottomSheetCallback);
        bottomSheetCallback = new BottomSheetBehavior.BottomSheetCallback() {
            @Override
            public void onStateChanged(@NonNull View view, int i) {
                nativeEventCount++;
                WritableMap event = Arguments.createMap();
                event.putInt("detent", i);
                event.putInt("eventCount", nativeEventCount);
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "onDetentChanged", event);
            }

            @Override
            public void onSlide(@NonNull View view, float v) {

            }
        };
        bottomSheetBehavior.addBottomSheetCallback(bottomSheetCallback);
    }
}
