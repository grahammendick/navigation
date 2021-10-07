package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;

public class ExtendedFloatingActionButtonView extends ExtendedFloatingActionButton {
    private final IconResolver.IconResolverListener iconResolverListener;

    public ExtendedFloatingActionButtonView(@NonNull Context context) {
        super(context);
        iconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                setIcon(d);
            }
        };
    }

    void setIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, iconResolverListener, getContext());
    }
}
