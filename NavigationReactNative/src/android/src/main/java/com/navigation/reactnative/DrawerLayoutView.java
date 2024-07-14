package com.navigation.reactnative;

import android.content.Context;
import android.view.Gravity;
import android.view.MotionEvent;

import androidx.annotation.NonNull;
import androidx.drawerlayout.widget.DrawerLayout;

import com.facebook.react.uimanager.events.NativeGestureUtil;

public class DrawerLayoutView extends DrawerLayout {
    int nativeEventCount;
    int mostRecentEventCount;
    boolean pendingOpen;
    boolean dragging;
    private boolean layoutRequested = false;

    public DrawerLayoutView(@NonNull Context context) {
        super(context);
    }

    void onAfterUpdateTransaction() {
        int eventLag = nativeEventCount - mostRecentEventCount;
        if (eventLag == 0 && isOpen() != pendingOpen) {
            if (pendingOpen) openDrawer(Gravity.LEFT);
            else closeDrawer(Gravity.LEFT);
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        requestLayout();
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        if (!layoutRequested) {
            layoutRequested = true;
            post(measureAndLayout);
        }
    }

    private final Runnable measureAndLayout = () -> {
        layoutRequested = false;
        measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
    };

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        if (super.onInterceptTouchEvent(ev)) {
            NativeGestureUtil.notifyNativeGestureStarted(this, ev);
            dragging = true;
            return true;
        }
        return false;
    }

    @Override
    public boolean onTouchEvent(MotionEvent ev) {
        int action = ev.getActionMasked();
        if (action == MotionEvent.ACTION_UP && dragging) {
            NativeGestureUtil.notifyNativeGestureEnded(this, ev);
            dragging = false;
        }
        return super.onTouchEvent(ev);
    }
}
