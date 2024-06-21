package com.navigation.reactnative;

import android.content.Context;
import android.view.MotionEvent;
import android.view.View;

import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.uimanager.JSTouchDispatcher;
import com.facebook.react.uimanager.RootView;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.view.ReactViewGroup;

public class DialogRootView extends ReactViewGroup implements RootView {
    private final JSTouchDispatcher jsTouchDispatcher = new JSTouchDispatcher(this);
    EventDispatcher eventDispatcher;

    public DialogRootView(Context context) {
        super(context);
    }

    @Override
    protected void onSizeChanged(final int w, final int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
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
                    uiManager.updateNodeSize(getId(), w, h);
                }
            });
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
    public void onChildStartedNativeGesture(View view, MotionEvent motionEvent) {
        jsTouchDispatcher.onChildStartedNativeGesture(motionEvent, eventDispatcher);
    }

    @Override
    public void onChildStartedNativeGesture(MotionEvent motionEvent) {
        this.onChildStartedNativeGesture(null, motionEvent);
    }

    @Override
    public void onChildEndedNativeGesture(View view, MotionEvent motionEvent) {
        jsTouchDispatcher.onChildEndedNativeGesture(motionEvent, eventDispatcher);
    }

    @Override
    public void handleException(Throwable throwable) {
        ((ThemedReactContext) getContext()).getReactApplicationContext().handleException(new RuntimeException(throwable));
    }

    @Override
    public void requestDisallowInterceptTouchEvent(boolean disallowIntercept) {
    }
}
