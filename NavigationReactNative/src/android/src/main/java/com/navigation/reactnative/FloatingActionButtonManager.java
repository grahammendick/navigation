package com.navigation.reactnative;

import android.content.res.ColorStateList;
import android.view.Gravity;

import androidx.annotation.NonNull;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

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

    @ReactProp(name = "gravity")
    public void setGravity(FloatingActionButtonView view, String gravity) {
        if ("topLeft".equals(gravity)) view.params.gravity = Gravity.TOP | Gravity.LEFT;
        else if ("top".equals(gravity)) view.params.gravity = Gravity.TOP | Gravity.CENTER;
        else if ("topRight".equals(gravity)) view.params.gravity = Gravity.TOP | Gravity.RIGHT;
        else if ("left".equals(gravity)) view.params.gravity = Gravity.CENTER | Gravity.LEFT;
        else if ("center".equals(gravity)) view.params.gravity = Gravity.CENTER;
        else if ("right".equals(gravity)) view.params.gravity = Gravity.CENTER | Gravity.RIGHT;
        else if ("bottomLeft".equals(gravity)) view.params.gravity = Gravity.BOTTOM | Gravity.LEFT;
        else if ("bottom".equals(gravity)) view.params.gravity = Gravity.BOTTOM | Gravity.CENTER;
        else if ("bottomRight".equals(gravity)) view.params.gravity = Gravity.BOTTOM | Gravity.RIGHT;
        else view.params.gravity = Gravity.NO_GRAVITY;
        if (view.getParent() instanceof CoordinatorLayoutView) {
            CoordinatorLayoutView coordinatorLayoutView = (CoordinatorLayoutView) view.getParent();
            coordinatorLayoutView.requestLayout();
        }
    }
}
