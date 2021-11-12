package com.navigation.reactnative;

import android.view.MenuItem;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.appcompat.widget.ActionMenuView;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class BarButtonManager extends ViewGroupManager<BarButtonView> {
    @NonNull
    @Override
    public String getName() {
        return "NVBarButton";
    }

    @NonNull
    @Override
    protected BarButtonView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new BarButtonView(reactContext);
    }

    @ReactProp(name = "title")
    public void setTitle(BarButtonView view, String title) {
        view.setTitle(title);
    }

    @ReactProp(name = "fontFamily")
    public void setFontFamily(BarButtonView view, String fontFamily) {
        view.setFontFamily(fontFamily);
    }

    @ReactProp(name = "fontWeight")
    public void setFontWeight(BarButtonView view, String fontWeight) {
        view.setFontWeight(fontWeight);
    }

    @ReactProp(name = "fontStyle")
    public void setFontStyle(BarButtonView view, String fontStyle) {
        view.setFontStyle(fontStyle);
    }

    @ReactProp(name = "fontSize")
    public void setFontSize(BarButtonView view, Integer fontSize) {
        view.setFontSize(fontSize);
    }

    @ReactProp(name = "image")
    public void setImage(BarButtonView view, ReadableMap icon) {
        view.setIconSource(icon);
    }

    @ReactProp(name = "showAsAction")
    public void setShowAsAction(BarButtonView view, Integer showAsAction) {
        view.setShowAsAction(showAsAction != null ? showAsAction : MenuItem.SHOW_AS_ACTION_NEVER);
    }

    @ReactProp(name = "collapsible")
    public void setCollapsible(BarButtonView view, Boolean collapsible) {
        view.setCollapsible(collapsible != null ? collapsible : false);
    }

    @ReactProp(name = "search")
    public void setSearch(BarButtonView view, Boolean search) {
        view.setSearch(search != null ? search : false);
    }

    @ReactProp(name = "width")
    public void setWidth(BarButtonView view, double width) {
        view.setLayoutParams(new ActionMenuView.LayoutParams((int) PixelUtil.toPixelFromDIP(width), ViewGroup.LayoutParams.WRAP_CONTENT));
    }

    @ReactProp(name = "showActionView")
    public void setShowActionView(BarButtonView view, boolean showActionView) {
        view.setShowActionView(showActionView);
    }

    @ReactProp(name = "testID")
    public void setTestID(BarButtonView view, String testID) {
        view.testID = testID;
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull BarButtonView view) {
        super.onAfterUpdateTransaction(view);
        view.styleTitle();
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("onPress", MapBuilder.of("registrationName", "onPress"))
            .build();
    }
}
