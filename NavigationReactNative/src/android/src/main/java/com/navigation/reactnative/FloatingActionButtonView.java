package com.navigation.reactnative;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

public class FloatingActionButtonView extends FloatingActionButton {
    final int defaultBackgroundColor;
    final CoordinatorLayout.LayoutParams params;
    int marginTop, marginRight, marginBottom, marginLeft, marginStart, marginEnd, margin;
    private final IconResolver.IconResolverListener iconResolverListener;

    public FloatingActionButtonView(@NonNull Context context) {
        super(context);
        setSize(SIZE_NORMAL);
        defaultBackgroundColor = getBackgroundTintList() != null ? getBackgroundTintList().getDefaultColor() : Color.BLACK;
        params = new CoordinatorLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.setBehavior(getBehavior());
        setLayoutParams(params);
        iconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                setImageDrawable(d);
            }
        };
        setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                ReactContext reactContext = (ReactContext) getContext();
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
                eventDispatcher.dispatchEvent(new FloatingActionButtonView.PressEvent(getId()));
            }
        });
    }

    void setIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, iconResolverListener, getContext());
    }

    static class PressEvent extends Event<FloatingActionButtonView.PressEvent> {
        public PressEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topOnPress";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
        }
    }
}
