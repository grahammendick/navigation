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
        view.setActionText(text);
    }

    @ReactProp(name = "backgroundColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBackgroundColor(ExtendedFloatingActionButtonView view, int backgroundColor) {
        view.setBackgroundTintList(ColorStateList.valueOf(backgroundColor != Integer.MAX_VALUE ? backgroundColor : view.defaultBackgroundColor));
    }

    @ReactProp(name = "rippleColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setRippleColor(ExtendedFloatingActionButtonView view, int rippleColor) {
        view.setRippleColor(ColorStateList.valueOf(rippleColor != Integer.MAX_VALUE ? rippleColor : view.defaultRippleColor));
    }

    @ReactProp(name = "color", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setColor(ExtendedFloatingActionButtonView view, int color) {
        ColorStateList colorList = ColorStateList.valueOf(color != Integer.MAX_VALUE ? color : view.defaultColor);
        view.setIconTint(colorList);
        view.setTextColor(colorList);
    }

    @ReactProp(name = "anchor")
    public void setAnchor(ExtendedFloatingActionButtonView view, @Nullable String anchor) {
        if ("navigationBar".equals(anchor) || "bottomNavigationBar".equals(anchor) || "bottomSheet".equals(anchor)) {
            view.setAnchor(anchor);
        } else {
            view.params.setAnchorId(anchor != null ? Integer.parseInt(anchor) : View.NO_ID);
            view.setAnchor(null);
        }
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "gravity")
    public void setGravity(ExtendedFloatingActionButtonView view, String gravity) {
        view.params.gravity = convertGravity(gravity);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "anchorGravity")
    public void setAnchorGravity(ExtendedFloatingActionButtonView view, String anchorGravity) {
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
    public void setMarginTop(ExtendedFloatingActionButtonView view, int marginTop) {
        view.marginTop = (int) PixelUtil.toPixelFromDIP(marginTop);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginRight")
    public void setMarginRight(ExtendedFloatingActionButtonView view, int marginRight) {
        view.marginRight = (int) PixelUtil.toPixelFromDIP(marginRight);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginBottom")
    public void setMarginBottom(ExtendedFloatingActionButtonView view, int marginBottom) {
        view.marginBottom = (int) PixelUtil.toPixelFromDIP(marginBottom);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginStart")
    public void setMarginStart(ExtendedFloatingActionButtonView view, int marginStart) {
        view.marginStart = (int) PixelUtil.toPixelFromDIP(marginStart);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginEnd")
    public void setMarginEnd(ExtendedFloatingActionButtonView view, int marginEnd) {
        view.marginEnd = (int) PixelUtil.toPixelFromDIP(marginEnd);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginLeft")
    public void setMarginLeft(ExtendedFloatingActionButtonView view, int marginLeft) {
        view.marginLeft = (int) PixelUtil.toPixelFromDIP(marginLeft);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "margin")
    public void setMargin(ExtendedFloatingActionButtonView view, int margin) {
        view.margin = (int) PixelUtil.toPixelFromDIP(margin);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "fontFamily")
    public void setFontFamily(ExtendedFloatingActionButtonView view, String fontFamily) {
        view.setFontFamily(fontFamily);
    }

    @ReactProp(name = "fontWeight")
    public void setFontWeight(ExtendedFloatingActionButtonView view, String fontWeight) {
        view.setFontWeight(fontWeight);
    }

    @ReactProp(name = "fontStyle")
    public void setFontStyle(ExtendedFloatingActionButtonView view, String fontStyle) {
        view.setFontStyle(fontStyle);
    }

    @ReactProp(name = "fontSize")
    public void setFontSize(ExtendedFloatingActionButtonView view, Integer fontSize) {
        view.setFontSize(fontSize);
    }

    @ReactProp(name = "contentDescription")
    public void setContentDescription(ExtendedFloatingActionButtonView view, String contentDescription) {
        view.setContentDescription(contentDescription);
    }

    @ReactProp(name = "testID")
    public void setTestID(ExtendedFloatingActionButtonView view, String testID) {
        view.setTag(testID);
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull ExtendedFloatingActionButtonView view) {
        super.onAfterUpdateTransaction(view);
        boolean rtl = I18nUtil.getInstance().isRTL(view.getContext());
        int marginLeft = Math.max(view.marginLeft, !rtl ? view.marginStart : view.marginEnd);
        int marginRight = Math.max(view.marginRight, !rtl ? view.marginEnd : view.marginStart);
        view.params.setMargins(
            Math.max(marginLeft, view.margin), Math.max(view.marginTop, view.margin),
            Math.max(marginRight, view.margin), Math.max(view.marginBottom, view.margin
        ));
        view.styleText();
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topPress", MapBuilder.of("registrationName", "onPress"))
            .build();
    }
}
