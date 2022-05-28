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
import com.facebook.react.viewmanagers.NVExtendedFloatingActionButtonManagerDelegate;
import com.facebook.react.viewmanagers.NVExtendedFloatingActionButtonManagerInterface;

import java.util.Map;

public class ExtendedFloatingActionButtonViewManager extends SimpleViewManager<ExtendedFloatingActionButtonView> implements NVExtendedFloatingActionButtonManagerInterface<ExtendedFloatingActionButtonView> {
    private final ViewManagerDelegate<ExtendedFloatingActionButtonView> delegate;

    public ExtendedFloatingActionButtonViewManager() {
        delegate = new NVExtendedFloatingActionButtonManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<ExtendedFloatingActionButtonView> getDelegate() {
        return delegate;
    }

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

    @ReactProp(name = "backgroundColor", customType = "Color")
    public void setFabBackgroundColor(ExtendedFloatingActionButtonView view, @Nullable Integer backgroundColor) {
        view.setBackgroundTintList(ColorStateList.valueOf(backgroundColor != null ? backgroundColor : view.defaultBackgroundColor));
    }

    @ReactProp(name = "color", customType = "Color")
    public void setFabColor(ExtendedFloatingActionButtonView view, @Nullable Integer color) {
        ColorStateList colorList = ColorStateList.valueOf(color != null ? color : view.defaultColor);
        view.setIconTint(colorList);
        view.setTextColor(colorList);
    }

    @ReactProp(name = "anchor", defaultInt = View.NO_ID)
    public void setAnchor(ExtendedFloatingActionButtonView view, int anchor) {
        view.params.setAnchorId(anchor);
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
    public void setFabMarginTop(ExtendedFloatingActionButtonView view, int marginTop) {
        view.marginTop = (int) PixelUtil.toPixelFromDIP(marginTop);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginRight")
    public void setFabMarginRight(ExtendedFloatingActionButtonView view, int marginRight) {
        view.marginRight = (int) PixelUtil.toPixelFromDIP(marginRight);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginBottom")
    public void setFabMarginBottom(ExtendedFloatingActionButtonView view, int marginBottom) {
        view.marginBottom = (int) PixelUtil.toPixelFromDIP(marginBottom);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginStart")
    public void setFabMarginStart(ExtendedFloatingActionButtonView view, int marginStart) {
        view.marginStart = (int) PixelUtil.toPixelFromDIP(marginStart);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginEnd")
    public void setFabMarginEnd(ExtendedFloatingActionButtonView view, int marginEnd) {
        view.marginEnd = (int) PixelUtil.toPixelFromDIP(marginEnd);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "marginLeft")
    public void setFabMarginLeft(ExtendedFloatingActionButtonView view, int marginLeft) {
        view.marginLeft = (int) PixelUtil.toPixelFromDIP(marginLeft);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "margin")
    public void setFabMargin(ExtendedFloatingActionButtonView view, int margin) {
        view.margin = (int) PixelUtil.toPixelFromDIP(margin);
        if (view.getParent() != null) view.getParent().requestLayout();
    }

    @ReactProp(name = "fontFamily")
    public void setFabFontFamily(ExtendedFloatingActionButtonView view, String fontFamily) {
        view.setFontFamily(fontFamily);
    }

    @ReactProp(name = "fontWeight")
    public void setFabFontWeight(ExtendedFloatingActionButtonView view, String fontWeight) {
        view.setFontWeight(fontWeight);
    }

    @ReactProp(name = "fontStyle")
    public void setFabFontStyle(ExtendedFloatingActionButtonView view, String fontStyle) {
        view.setFontStyle(fontStyle);
    }

    @ReactProp(name = "fontSize")
    public void setFabFontSize(ExtendedFloatingActionButtonView view, float fontSize) {
        view.setFontSize(fontSize != -1 ? (int) fontSize : null);
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
            .put("onPress", MapBuilder.of("registrationName", "onPress"))
            .build();
    }
}
