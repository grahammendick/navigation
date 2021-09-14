package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

public class FloatingActionButtonView extends FloatingActionButton {
    final int defaultBackgroundColor;
    private final IconResolver.IconResolverListener iconResolverListener;

    public FloatingActionButtonView(@NonNull Context context) {
        super(context);
        defaultBackgroundColor = getBackgroundTintList().getDefaultColor();
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
