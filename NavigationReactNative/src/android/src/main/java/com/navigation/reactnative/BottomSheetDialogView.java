package com.navigation.reactnative;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.UiThread;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.JSTouchDispatcher;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.RootView;
import com.facebook.react.uimanager.StateWrapper;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

public class BottomSheetDialogView extends ReactViewGroup {
    private final BottomSheetFragment bottomSheetFragment;
    BottomSheetBehavior<FrameLayout> bottomSheetBehavior;
    final SheetView sheetView;
    float defaultHalfExpandedRatio;
    int pendingDetent;
    int detent;
    int nativeEventCount;
    int mostRecentEventCount;
    private boolean dismissed = true;

    public BottomSheetDialogView(Context context) {
        super(context);
        bottomSheetFragment = new BottomSheetFragment();
        bottomSheetBehavior = new BottomSheetBehavior<>();
        bottomSheetBehavior.setPeekHeight(BottomSheetBehavior.PEEK_HEIGHT_AUTO);
        bottomSheetFragment.dialogView = this;
        bottomSheetBehavior.setFitToContents(false);
        sheetView = new SheetView(context);
        defaultHalfExpandedRatio = bottomSheetBehavior.getHalfExpandedRatio();
    }

    void onAfterUpdateTransaction() {
        int eventLag = nativeEventCount - mostRecentEventCount;
        if (eventLag == 0) {
            detent = pendingDetent;
        }
        if (bottomSheetBehavior.getState() != detent && detent != BottomSheetBehavior.STATE_HIDDEN)
            bottomSheetBehavior.setState(detent);
        if (dismissed && detent != BottomSheetBehavior.STATE_HIDDEN) {
            Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
            FragmentManager fragmentManager = ((FragmentActivity) currentActivity).getSupportFragmentManager();
            bottomSheetFragment.show(fragmentManager, "BottomSheetDialog");
            dismissed = false;
        }
        if (!dismissed && detent == BottomSheetBehavior.STATE_HIDDEN) {
            bottomSheetFragment.dismiss();
        }
    }


    @Nullable
    public StateWrapper getStateWrapper() {
        return sheetView.getStateWrapper();
    }

    public void setStateWrapper(StateWrapper stateWrapper) {
        sheetView.setStateWrapper(stateWrapper);
    }

    public void updateState(final int width, final int height) {
        sheetView.updateState(width, height);
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        if (!dismissed) bottomSheetFragment.dismissAllowingStateLoss();
    }

    public static class BottomSheetFragment extends BottomSheetDialogFragment {
        private BottomSheetDialogView dialogView;
        BottomSheetBehavior.BottomSheetCallback bottomSheetCallback;

        @SuppressLint("Range")
        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            if (bottomSheetCallback == null && dialogView != null) {
                BottomSheetBehavior<FrameLayout> behavior = ((BottomSheetDialog) getDialog()).getBehavior();
                behavior.setPeekHeight(dialogView.bottomSheetBehavior.getPeekHeight());
                behavior.setExpandedOffset(dialogView.bottomSheetBehavior.getExpandedOffset());
                behavior.setFitToContents(dialogView.bottomSheetBehavior.isFitToContents());
                behavior.setHalfExpandedRatio(dialogView.bottomSheetBehavior.getHalfExpandedRatio());
                behavior.setHideable(dialogView.bottomSheetBehavior.isHideable());
                behavior.setSkipCollapsed(dialogView.bottomSheetBehavior.getSkipCollapsed());
                behavior.setDraggable(dialogView.bottomSheetBehavior.isDraggable());
                bottomSheetCallback = new BottomSheetBehavior.BottomSheetCallback() {
                    @Override
                    public void onStateChanged(@NonNull View view, int i) {
                        dialogView.nativeEventCount++;
                        dialogView.detent = i;
                        ReactContext reactContext = (ReactContext) dialogView.getContext();
                        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
                        eventDispatcher.dispatchEvent(new BottomSheetDialogView.DetentChangedEvent(dialogView.getId(), dialogView.detent, dialogView.nativeEventCount));
                    }

                    @Override
                    public void onSlide(@NonNull View view, float v) {
                    }
                };
                behavior.addBottomSheetCallback(bottomSheetCallback);
                dialogView.bottomSheetBehavior = behavior;
            }
            return dialogView != null ? dialogView.sheetView : new View(getContext());
        }

        @Override
        public void onResume() {
            super.onResume();
            if (dialogView == null) this.dismissAllowingStateLoss();
        }

        @Override
        public void onDismiss(@NonNull DialogInterface dialog) {
            super.onDismiss(dialog);
            if (dialogView != null) {
                dialogView.nativeEventCount++;
                dialogView.detent = BottomSheetBehavior.STATE_HIDDEN;
                dialogView.dismissed = true;
                ReactContext reactContext = (ReactContext) dialogView.getContext();
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, dialogView.getId());
                eventDispatcher.dispatchEvent(new BottomSheetDialogView.DetentChangedEvent(dialogView.getId(), dialogView.detent, dialogView.nativeEventCount));
                eventDispatcher.dispatchEvent(new BottomSheetDialogView.DismissedEvent(dialogView.getId()));
            }
        }
    }

    static class SheetView extends ReactViewGroup implements RootView
    {
        private int viewWidth;
        private int viewHeight;
        private int expandedOffset = 0;
        private final JSTouchDispatcher jsTouchDispatcher = new JSTouchDispatcher(this);
        EventDispatcher eventDispatcher;
        private StateWrapper stateWrapper = null;

        public SheetView(Context context) {
            super(context);
            setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
        }

        public void setExpandedOffset(int expandedOffset) {
            this.expandedOffset = expandedOffset;
            updateFirstChildView();
        }

        public void setExpandedHeight(int expandedHeight) {
            getLayoutParams().height = expandedHeight;
            updateFirstChildView();
        }

        @Override
        protected void onSizeChanged(final int w, final int h, int oldw, int oldh) {
            super.onSizeChanged(w, h, oldw, oldh);
            viewWidth = w;
            viewHeight = h;
            updateFirstChildView();
        }

        private void updateFirstChildView() {
            if (getChildCount() > 0) {
                final int viewTag = getChildAt(0).getId();
                if (stateWrapper != null) {
                    updateState(viewWidth, getLayoutParams().height > 0 ? getLayoutParams().height : viewHeight - expandedOffset);
                } else {
                    ThemedReactContext reactContext = (ThemedReactContext) getContext();
                    reactContext.runOnNativeModulesQueueThread(
                        new GuardedRunnable(reactContext) {
                            @Override
                            public void runGuarded() {
                                UIManagerModule uiManager = ((ThemedReactContext) getContext())
                                        .getReactApplicationContext()
                                        .getNativeModule(UIManagerModule.class);
                                if (uiManager == null) {
                                    return;
                                }
                                uiManager.updateNodeSize(viewTag, viewWidth, getLayoutParams().height > 0 ? getLayoutParams().height : viewHeight - expandedOffset);
                            }
                        });
                }
            }
        }

        @UiThread
        public void updateState(final int width, final int height) {
            final float realWidth = PixelUtil.toDIPFromPixel(width);
            final float realHeight = PixelUtil.toDIPFromPixel(height);
            ReadableMap currentState = stateWrapper.getStateData();
            if (currentState != null) {
                float delta = (float) 0.9;
                float stateScreenHeight =
                        currentState.hasKey("frameHeight")
                                ? (float) currentState.getDouble("frameHeight")
                                : 0;
                float stateScreenWidth =
                        currentState.hasKey("frameWidth") ? (float) currentState.getDouble("frameWidth") : 0;

                if (Math.abs(stateScreenWidth - realWidth) < delta
                        && Math.abs(stateScreenHeight - realHeight) < delta) {
                    return;
                }
            }
            if (stateWrapper != null) {
                WritableMap map = new WritableNativeMap();
                map.putDouble("frameWidth", realWidth);
                map.putDouble("frameHeight", realHeight);
                stateWrapper.updateState(map);
            }
        }

        @Override
        public void addView(View child, int index, LayoutParams params) {
            super.addView(child, index, params);
            updateFirstChildView();
        }

        @Override
        public boolean onInterceptTouchEvent(MotionEvent event) {
            jsTouchDispatcher.handleTouchEvent(event, eventDispatcher);
            return super.onInterceptTouchEvent(event);
        }

        @Override
        public boolean onTouchEvent(MotionEvent event) {
            jsTouchDispatcher.handleTouchEvent(event, eventDispatcher);
            super.onTouchEvent(event);
            return true;
        }

        @Override
        public void onChildStartedNativeGesture(View childView, MotionEvent ev) {
            jsTouchDispatcher.onChildStartedNativeGesture(ev, eventDispatcher);
        }

        @Override
        public void onChildStartedNativeGesture(MotionEvent motionEvent) {
            this.onChildStartedNativeGesture(null, motionEvent);
        }

        @Override
        public void onChildEndedNativeGesture(View childView, MotionEvent ev) {
            jsTouchDispatcher.onChildEndedNativeGesture(ev, eventDispatcher);
        }

        @Override
        public void handleException(Throwable throwable) {
            ((ThemedReactContext) getContext()).getReactApplicationContext().handleException(new RuntimeException(throwable));
        }

        @Override
        public void requestDisallowInterceptTouchEvent(boolean disallowIntercept) {
        }

        @Nullable
        public StateWrapper getStateWrapper() {
            return this.stateWrapper;
        }

        public void setStateWrapper(StateWrapper stateWrapper) {
            this.stateWrapper = stateWrapper;
        }
    }

    static class DetentChangedEvent extends Event<BottomSheetDialogView.DetentChangedEvent> {
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

    static class DismissedEvent extends Event<BottomSheetDialogView.DismissedEvent> {
        public DismissedEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topOnDismissed";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), Arguments.createMap());
        }
    }
}
