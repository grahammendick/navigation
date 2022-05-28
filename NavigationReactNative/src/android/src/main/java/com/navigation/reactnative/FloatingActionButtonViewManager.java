package com.navigation.reactnative;

import android.content.res.ColorStateList;
import android.view.Gravity;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.NVFloatingActionButtonManagerDelegate;
import com.facebook.react.viewmanagers.NVFloatingActionButtonManagerInterface;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.Map;

public class FloatingActionButtonViewManager extends SimpleViewManager<FloatingActionButtonView> implements NVFloatingActionButtonManagerInterface<FloatingActionButtonView> {
    private final ViewManagerDelegate<FloatingActionButtonView> delegate;

    public FloatingActionButtonViewManager() {
        delegate = new NVFloatingActionButtonManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<FloatingActionButtonView> getDelegate() {
        return delegate;
    }

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
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "gravity")
    public void setGravity(FloatingActionButtonView view, String gravity) {
        view.params.gravity = convertGravity(gravity);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "anchorGravity")
    public void setAnchorGravity(FloatingActionButtonView view, String anchorGravity) {
        view.params.anchorGravity = convertGravity(anchorGravity);
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

    @ReactProp(name = "marginTop")
    public void setMarginTop(FloatingActionButtonView view, int marginTop) {
        view.marginTop = (int) PixelUtil.toPixelFromDIP(marginTop);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginRight")
    public void setMarginRight(FloatingActionButtonView view, int marginRight) {
        view.marginRight = (int) PixelUtil.toPixelFromDIP(marginRight);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginBottom")
    public void setMarginBottom(FloatingActionButtonView view, int marginBottom) {
        view.marginBottom = (int) PixelUtil.toPixelFromDIP(marginBottom);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginStart")
    public void setMarginStart(FloatingActionButtonView view, int marginStart) {
        view.marginStart = (int) PixelUtil.toPixelFromDIP(marginStart);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginEnd")
    public void setMarginEnd(FloatingActionButtonView view, int marginEnd) {
        view.marginEnd = (int) PixelUtil.toPixelFromDIP(marginEnd);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginLeft")
    public void setMarginLeft(FloatingActionButtonView view, int marginLeft) {
        view.marginLeft = (int) PixelUtil.toPixelFromDIP(marginLeft);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "margin")
    public void setMargin(FloatingActionButtonView view, int margin) {
        view.margin = (int) PixelUtil.toPixelFromDIP(margin);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "elevation")
    public void setElevation(FloatingActionButtonView view, int elevation) {
        view.setCompatElevation(PixelUtil.toPixelFromDIP(elevation));
    }

    @ReactProp(name = "contentDescription")
    public void setContentDescription(FloatingActionButtonView view, String contentDescription) {
        view.setContentDescription(contentDescription);
    }

    @ReactProp(name = "size")
    public void setSize(FloatingActionButtonView view, int size) {
        view.clearCustomSize();
        if (size > 0) view.setCustomSize((int) PixelUtil.toPixelFromDIP(size));
        else view.setSize(FloatingActionButton.SIZE_NORMAL);
    }

    @ReactProp(name = "testID")
    public void setTestID(FloatingActionButtonView view, String testID) {
        view.setTag(testID);
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull FloatingActionButtonView view) {
        super.onAfterUpdateTransaction(view);
        boolean rtl = I18nUtil.getInstance().isRTL(view.getContext());
        int marginLeft = Math.max(view.marginLeft, !rtl ? view.marginStart : view.marginEnd);
        int marginRight = Math.max(view.marginRight, !rtl ? view.marginEnd : view.marginStart);
        view.params.setMargins(
            Math.max(marginLeft, view.margin), Math.max(view.marginTop, view.margin),
            Math.max(marginRight, view.margin), Math.max(view.marginBottom, view.margin
        ));
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("onPress", MapBuilder.of("registrationName", "onPress"))
            .build();
    }
}
