package com.navigation.reactnative;

import android.content.Context;
import android.view.ViewGroup;

import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;

public class TitleBarView extends ViewGroup {
    public TitleBarView(Context context) {
        super(context);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    protected void onSizeChanged(final int w, final int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (w == oldw && h == oldh) {
            return;
        }
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
