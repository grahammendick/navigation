package com.navigation.reactnative;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.bridge.ReadableMap;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

public class FloatingActionButtonView extends FloatingActionButton {
    final int defaultBackgroundColor;
    final CoordinatorLayout.LayoutParams params;
    int marginTop, marginRight, marginBottom, marginLeft, margin;
    private final IconResolver.IconResolverListener iconResolverListener;

    public FloatingActionButtonView(@NonNull Context context) {
        super(context);
        defaultBackgroundColor = getBackgroundTintList() != null ? getBackgroundTintList().getDefaultColor() : Color.BLACK;
        params = new CoordinatorLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        setLayoutParams(params);
        iconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                setImageDrawable(d);
            }
        };
    }

    void setIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, iconResolverListener, getContext());
    }
}
