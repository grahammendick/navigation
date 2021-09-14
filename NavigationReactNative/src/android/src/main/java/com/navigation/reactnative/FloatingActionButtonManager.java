package com.navigation.reactnative;

import android.content.res.ColorStateList;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class FloatingActionButtonManager extends SimpleViewManager<FloatingActionButtonView> {
    @NonNull
    @Override
    public String getName() {
        return "NVFloatingActionButton";
    }

    @NonNull
    @Override
    protected FloatingActionButtonView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new FloatingActionButtonView(reactContext);
    }

    @ReactProp(name = "image")
    public void setImage(FloatingActionButtonView view, ReadableMap icon) {
        view.setIconSource(icon);
    }

    @ReactProp(name = "backgroundColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBackgroundColor(FloatingActionButtonView view, int backgroundColor) {
        view.setBackgroundTintList(ColorStateList.valueOf(backgroundColor != Integer.MAX_VALUE ? backgroundColor : view.defaultBackgroundColor));
    }

    @ReactProp(name = "color", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setColor(FloatingActionButtonView view, int color) {
        view.setImageTintList(color != Integer.MAX_VALUE ? ColorStateList.valueOf(color) : null);
    }
}
