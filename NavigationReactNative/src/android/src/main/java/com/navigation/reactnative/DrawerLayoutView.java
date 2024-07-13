package com.navigation.reactnative;

import android.content.Context;
import android.view.MotionEvent;

import androidx.annotation.NonNull;
import androidx.drawerlayout.widget.DrawerLayout;

import com.facebook.react.uimanager.events.NativeGestureUtil;

public class DrawerLayoutView extends DrawerLayout {
    boolean dragging;
    public DrawerLayoutView(@NonNull Context context) {
        super(context);
    }

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
