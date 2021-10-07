package com.navigation.reactnative;

import android.content.res.ColorStateList;
import android.view.Gravity;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class ExtendedFloatingActionButtonManager extends SimpleViewManager<ExtendedFloatingActionButtonView> {
    @NonNull
    @Override
    public String getName() {
        return "NVExtendedFloatingActionButton";
    }

    @NonNull
    @Override
    protected ExtendedFloatingActionButtonView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new ExtendedFloatingActionButtonView(reactContext);
    }

    @ReactProp(name = "image")
    public void setImage(ExtendedFloatingActionButtonView view, ReadableMap icon) {
        view.setIconSource(icon);
    }

    @ReactProp(name = "text")
    public void setText(ExtendedFloatingActionButtonView view, String text) {
        view.setText(text);
    }

    @ReactProp(name = "backgroundColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBackgroundColor(ExtendedFloatingActionButtonView view, int backgroundColor) {
        view.setBackgroundTintList(ColorStateList.valueOf(backgroundColor != Integer.MAX_VALUE ? backgroundColor : view.defaultBackgroundColor));
    }

    @ReactProp(name = "color", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setColor(ExtendedFloatingActionButtonView view, int color) {
        ColorStateList colorList = ColorStateList.valueOf(color != Integer.MAX_VALUE ? color : view.defaultColor);
        view.setIconTint(colorList);
        view.setTextColor(colorList);
    }

    @ReactProp(name = "gravity")
    public void setGravity(ExtendedFloatingActionButtonView view, String gravity) {
        view.params.gravity = convertGravity(gravity);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    private int convertGravity(String gravity) {
        if ("topLeft".equals(gravity)) return Gravity.TOP | Gravity.LEFT;
        if ("topStart".equals(gravity)) return Gravity.TOP | Gravity.START;
        if ("top".equals(gravity)) return Gravity.TOP | Gravity.CENTER;
        if ("topRight".equals(gravity)) return Gravity.TOP | Gravity.RIGHT;
        if ("topEnd".equals(gravity)) return Gravity.TOP | Gravity.END;
        if ("left".equals(gravity)) return Gravity.CENTER | Gravity.LEFT;
        if ("start".equals(gravity)) return Gravity.CENTER | Gravity.START;
        if ("center".equals(gravity)) return Gravity.CENTER;
        if ("right".equals(gravity)) return Gravity.CENTER | Gravity.RIGHT;
        if ("end".equals(gravity)) return Gravity.CENTER | Gravity.END;
        if ("bottomLeft".equals(gravity)) return Gravity.BOTTOM | Gravity.LEFT;
        if ("bottomStart".equals(gravity)) return Gravity.BOTTOM | Gravity.START;
        if ("bottom".equals(gravity)) return Gravity.BOTTOM | Gravity.CENTER;
        if ("bottomRight".equals(gravity)) return Gravity.BOTTOM | Gravity.RIGHT;
        if ("bottomEnd".equals(gravity)) return Gravity.BOTTOM | Gravity.END;
        return Gravity.NO_GRAVITY;
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("onPress", MapBuilder.of("registrationName", "onPress"))
            .build();
    }
}
