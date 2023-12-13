package com.navigation.reactnative;

import android.content.Context;
import android.view.ViewGroup;

import androidx.annotation.UiThread;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.StateWrapper;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class ActionBarView extends ViewGroup {
    private boolean layoutRequested = false;
    private StateWrapper stateWrapper = null;

    public ActionBarView(Context context) {
        super(context);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    void expanded() {
        ReactContext reactContext = (ReactContext) getContext();
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
        eventDispatcher.dispatchEvent(new ActionBarView.ExpandedEvent(getId()));
    }

    void collapsed() {
        ReactContext reactContext = (ReactContext) getContext();
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
        eventDispatcher.dispatchEvent(new ActionBarView.CollapsedEvent(getId()));
    }

    public void setStateWrapper(StateWrapper stateWrapper) {
        this.stateWrapper = stateWrapper;
    }

    void changeBounds(final int width, final int height, int oldw, int oldh) {
        super.onSizeChanged(width, height, oldw, oldh);
        if (stateWrapper != null) {
            updateState(width, height);
        } else {
            final int viewTag = getId();
            final ReactContext reactContext = (ReactContext) getContext();
            reactContext.runOnNativeModulesQueueThread(
                new GuardedRunnable(reactContext) {
                    @Override
                    public void runGuarded() {
                        UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);
                        if (uiManager != null)
                            uiManager.updateNodeSize(viewTag, width, height);
                    }
                });
            
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
    public void requestLayout() {
        super.requestLayout();
        if (!layoutRequested) {
            layoutRequested = true;
            post(measureAndLayout);
        }
    }

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            layoutRequested = false;
            measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };

    static class ExpandedEvent extends Event<ActionBarView.ExpandedEvent> {
        public ExpandedEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topExpanded";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), Arguments.createMap());
        }
    }

    static class CollapsedEvent extends Event<ActionBarView.CollapsedEvent> {
        public CollapsedEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topCollapsed";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), Arguments.createMap());
        }
    }
}
