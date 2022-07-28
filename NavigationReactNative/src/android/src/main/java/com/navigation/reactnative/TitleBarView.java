package com.navigation.reactnative;

import android.content.Context;
import android.view.ViewGroup;

import androidx.annotation.UiThread;

import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.FabricViewStateManager;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.UIManagerModule;

public class TitleBarView extends ViewGroup implements FabricViewStateManager.HasFabricViewStateManager {
    private boolean layoutRequested = false;
    private final FabricViewStateManager fabricViewStateManager = new FabricViewStateManager();

    public TitleBarView(Context context) {
        super(context);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    protected void onSizeChanged(final int w, final int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (fabricViewStateManager.hasStateWrapper()) {
            updateState(w, h);
        } else {
            final int viewTag = getId();
            final ReactContext reactContext = (ReactContext) getContext();
            reactContext.runOnNativeModulesQueueThread(
                new GuardedRunnable(reactContext) {
                    @Override
                    public void runGuarded() {
                        UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);
                        if (uiManager != null)
                            uiManager.updateNodeSize(viewTag, w, h);
                    }
                });
        }
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
}
