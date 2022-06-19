package com.navigation.reactnative;

import android.content.Context;
import android.view.ViewGroup;

import androidx.annotation.UiThread;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.FabricViewStateManager;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class ActionBarView extends ViewGroup implements FabricViewStateManager.HasFabricViewStateManager {
    private boolean layoutRequested = false;
    private final FabricViewStateManager fabricViewStateManager = new FabricViewStateManager();

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

    void changeBounds(int width, int height, int oldw, int oldh) {
        super.onSizeChanged(width, height, oldw, oldh);
        updateState(width, height);
    }

    @UiThread
    public void updateState(final int width, final int height) {
        final float realWidth = PixelUtil.toDIPFromPixel(width);
        final float realHeight = PixelUtil.toDIPFromPixel(height);
        ReadableMap currentState = getFabricViewStateManager().getStateData();
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
        fabricViewStateManager.setState(
            new FabricViewStateManager.StateUpdateCallback() {
                @Override
                public WritableMap getStateUpdate() {
                    WritableMap map = new WritableNativeMap();
                    map.putDouble("frameWidth", realWidth);
                    map.putDouble("frameHeight", realHeight);
                    return map;
                }
            });
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

    @Override
    public FabricViewStateManager getFabricViewStateManager() {
        return fabricViewStateManager;
    }

    static class ExpandedEvent extends Event<ActionBarView.ExpandedEvent> {
        public ExpandedEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topOnExpanded";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
        }
    }

    static class CollapsedEvent extends Event<ActionBarView.CollapsedEvent> {
        public CollapsedEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topOnCollapsed";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
        }
    }
}
