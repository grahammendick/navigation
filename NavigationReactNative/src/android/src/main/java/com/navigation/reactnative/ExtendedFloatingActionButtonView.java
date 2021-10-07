package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;

public class ExtendedFloatingActionButtonView extends ExtendedFloatingActionButton {
    final int defaultBackgroundColor;
    final int defaultColor;
    final CoordinatorLayout.LayoutParams params;
    int marginTop, marginRight, marginBottom, marginLeft, marginStart, marginEnd, margin;
    private final IconResolver.IconResolverListener iconResolverListener;

    public ExtendedFloatingActionButtonView(@NonNull Context context) {
        super(context);
        TypedValue typedValue = new TypedValue();
        context.getTheme().resolveAttribute(R.attr.colorSecondary, typedValue, true);
        defaultBackgroundColor = typedValue.data;
        defaultColor = getCurrentTextColor();
        params = new CoordinatorLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.setBehavior(getBehavior());
        setLayoutParams(params);
        iconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                setIcon(d);
            }
        };
        setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onPress", null);
            }
        });
    }

    void setIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, iconResolverListener, getContext());
    }
}
