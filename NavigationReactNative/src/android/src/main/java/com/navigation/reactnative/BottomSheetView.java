package com.navigation.reactnative;

import android.content.Context;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.material.bottomsheet.BottomSheetBehavior;

public class BottomSheetView extends ReactViewGroup {
    BottomSheetBehavior<BottomSheetView> bottomSheetBehavior;
    BottomSheetBehavior.BottomSheetCallback bottomSheetCallback;
    float defaultHalfExpandedRatio;
    int pendingDetent;
    int detent;
    int nativeEventCount;
    int mostRecentEventCount;

    public BottomSheetView(Context context) {
        super(context);
        bottomSheetBehavior = new BottomSheetBehavior<>(context, null);
        detent = bottomSheetBehavior.getState();
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
                detent = i;
                ReactContext reactContext = (ReactContext) getContext();
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
                eventDispatcher.dispatchEvent(new BottomSheetView.DetentChangedEvent(getId(), detent, nativeEventCount));
            }

            @Override
            public void onSlide(@NonNull View view, float v) {
            }
        };
        bottomSheetBehavior.addBottomSheetCallback(bottomSheetCallback);
    }

    void onAfterUpdateTransaction() {
        int eventLag = nativeEventCount - mostRecentEventCount;
        if (eventLag == 0) {
            detent = pendingDetent;
        }
        if (bottomSheetBehavior.getState() != detent)
            bottomSheetBehavior.setState(detent);
    }

    static class DetentChangedEvent extends Event<BottomSheetView.DetentChangedEvent> {
        private final int detent;
        private final int eventCount;

        public DetentChangedEvent(int viewId, int detent, int eventCount) {
            super(viewId);
            this.detent = detent;
            this.eventCount = eventCount;
        }

        @Override
        public String getEventName() {
            return "topOnDetentChanged";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putInt("detent", this.detent);
            event.putInt("eventCount", this.eventCount);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }
}
