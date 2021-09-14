package com.navigation.reactnative;

import android.content.res.ColorStateList;
import android.view.Gravity;
import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

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

    @ReactProp(name = "anchor", defaultInt = View.NO_ID)
    public void setAnchor(FloatingActionButtonView view, int anchor) {
        view.params.setAnchorId(anchor);
        requestCoordinatorLayout(view);
    }

    @ReactProp(name = "gravity")
    public void setGravity(FloatingActionButtonView view, String gravity) {
        view.params.gravity = convertGravity(gravity);
        requestCoordinatorLayout(view);
    }

    @ReactProp(name = "anchorGravity")
    public void setAnchorGravity(FloatingActionButtonView view, String anchorGravity) {
        view.params.anchorGravity = convertGravity(anchorGravity);
        requestCoordinatorLayout(view);
    }

    private int convertGravity(String gravity) {
        if ("topLeft".equals(gravity)) return Gravity.TOP | Gravity.START;
        if ("top".equals(gravity)) return Gravity.TOP | Gravity.CENTER;
        if ("topRight".equals(gravity)) return Gravity.TOP | Gravity.END;
        if ("left".equals(gravity)) return Gravity.CENTER | Gravity.START;
        if ("center".equals(gravity)) return Gravity.CENTER;
        if ("right".equals(gravity)) return Gravity.CENTER | Gravity.END;
        if ("bottomLeft".equals(gravity)) return Gravity.BOTTOM | Gravity.START;
        if ("bottom".equals(gravity)) return Gravity.BOTTOM | Gravity.CENTER;
        if ("bottomRight".equals(gravity)) return Gravity.BOTTOM | Gravity.END;
        return Gravity.NO_GRAVITY;
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

    @ReactProp(name = "contentDescription")
    public void setContentDescription(FloatingActionButtonView view, String contentDescription) {
        view.setContentDescription(contentDescription);
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

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("onPress", MapBuilder.of("registrationName", "onPress"))
            .build();
    }
}
