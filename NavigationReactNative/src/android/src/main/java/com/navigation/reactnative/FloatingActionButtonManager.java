package com.navigation.reactnative;

import android.content.res.ColorStateList;
import android.view.Gravity;

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

    @ReactProp(name = "gravity")
    public void setGravity(FloatingActionButtonView view, String gravity) {
        if ("topLeft".equals(gravity)) view.params.gravity = Gravity.TOP | Gravity.START;
        else if ("top".equals(gravity)) view.params.gravity = Gravity.TOP | Gravity.CENTER;
        else if ("topRight".equals(gravity)) view.params.gravity = Gravity.TOP | Gravity.END;
        else if ("left".equals(gravity)) view.params.gravity = Gravity.CENTER | Gravity.START;
        else if ("center".equals(gravity)) view.params.gravity = Gravity.CENTER;
        else if ("right".equals(gravity)) view.params.gravity = Gravity.CENTER | Gravity.END;
        else if ("bottomLeft".equals(gravity)) view.params.gravity = Gravity.BOTTOM | Gravity.START;
        else if ("bottom".equals(gravity)) view.params.gravity = Gravity.BOTTOM | Gravity.CENTER;
        else if ("bottomRight".equals(gravity)) view.params.gravity = Gravity.BOTTOM | Gravity.END;
        else view.params.gravity = Gravity.NO_GRAVITY;
        requestCoordinatorLayout(view);
    }

    @ReactProp(name = "marginTop")
    public void setMarginTop(FloatingActionButtonView view, int marginTop) {
        view.marginTop = marginTop;
        requestCoordinatorLayout(view);
    }

    @ReactProp(name = "marginRight")
    public void setMarginRight(FloatingActionButtonView view, int marginRight) {
        view.marginRight = marginRight;
        requestCoordinatorLayout(view);
    }

    @ReactProp(name = "marginBottom")
    public void setMarginBottom(FloatingActionButtonView view, int marginBottom) {
        view.marginBottom = marginBottom;
        requestCoordinatorLayout(view);
    }

    @ReactProp(name = "marginLeft")
    public void setMarginLeft(FloatingActionButtonView view, int marginLeft) {
        view.marginLeft = marginLeft;
        requestCoordinatorLayout(view);
    }

    @ReactProp(name = "margin")
    public void setMargin(FloatingActionButtonView view, int margin) {
        view.margin = margin;
        requestCoordinatorLayout(view);
    }

    private void requestCoordinatorLayout(FloatingActionButtonView view) {
        if (view.getParent() instanceof CoordinatorLayoutView) {
            CoordinatorLayoutView coordinatorLayoutView = (CoordinatorLayoutView) view.getParent();
            coordinatorLayoutView.requestLayout();
        }
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull FloatingActionButtonView view) {
        super.onAfterUpdateTransaction(view);
        view.params.setMargins(
            Math.max(view.marginLeft, view.margin), Math.max(view.marginTop, view.margin),
            Math.max(view.marginRight, view.margin), Math.max(view.marginBottom, view.margin));
    }
}
