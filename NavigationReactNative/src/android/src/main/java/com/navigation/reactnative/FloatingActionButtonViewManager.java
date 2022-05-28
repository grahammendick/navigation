package com.navigation.reactnative;

import android.content.res.ColorStateList;
import android.view.Gravity;
import android.view.View;
import android.widget.ScrollView;

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

    @ReactProp(name = "fabBackgroundColor", customType = "Color")
    public void setFabBackgroundColor(FloatingActionButtonView view, @Nullable Integer backgroundColor) {
        view.setBackgroundTintList(ColorStateList.valueOf(backgroundColor != null ? backgroundColor : view.defaultBackgroundColor));
    }

    @ReactProp(name = "fabColor", customType = "Color")
    public void setFabColor(FloatingActionButtonView view, @Nullable Integer color) {
        view.setImageTintList(color != null ? ColorStateList.valueOf(color) : null);
    }

    @ReactProp(name = "anchor")
    public void setAnchor(FloatingActionButtonView view, @Nullable String anchor) {
        if ("navigationBar".equals(anchor) || "bottomSheet".equals(anchor)) {
            view.setAnchor(anchor);
        } else {
            view.params.setAnchorId(View.NO_ID);
            view.setAnchor(null);
        }
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

    @ReactProp(name = "fabMarginTop")
    public void setFabMarginTop(FloatingActionButtonView view, int marginTop) {
        view.marginTop = (int) PixelUtil.toPixelFromDIP(marginTop);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "fabMarginRight")
    public void setFabMarginRight(FloatingActionButtonView view, int marginRight) {
        view.marginRight = (int) PixelUtil.toPixelFromDIP(marginRight);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "fabMarginBottom")
    public void setFabMarginBottom(FloatingActionButtonView view, int marginBottom) {
        view.marginBottom = (int) PixelUtil.toPixelFromDIP(marginBottom);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "fabMarginStart")
    public void setFabMarginStart(FloatingActionButtonView view, int marginStart) {
        view.marginStart = (int) PixelUtil.toPixelFromDIP(marginStart);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "fabMarginEnd")
    public void setFabMarginEnd(FloatingActionButtonView view, int marginEnd) {
        view.marginEnd = (int) PixelUtil.toPixelFromDIP(marginEnd);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "fabMarginLeft")
    public void setFabMarginLeft(FloatingActionButtonView view, int marginLeft) {
        view.marginLeft = (int) PixelUtil.toPixelFromDIP(marginLeft);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "fabMargin")
    public void setFabMargin(FloatingActionButtonView view, int margin) {
        view.margin = (int) PixelUtil.toPixelFromDIP(margin);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "fabElevation")
    public void setFabElevation(FloatingActionButtonView view, int elevation) {
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
            .put("topOnPress", MapBuilder.of("registrationName", "onPress"))
            .build();
    }
}
