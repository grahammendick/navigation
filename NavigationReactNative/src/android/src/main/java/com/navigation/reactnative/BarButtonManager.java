package com.navigation.reactnative;

import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
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
        view.title  = title;
    }

    @ReactProp(name = "fontFamily")
    public void setFontFamily(BarButtonView view, String fontFamily) {
        view.fontFamily  = fontFamily;
    }

    @ReactProp(name = "image")
    public void setImage(BarButtonView view, ReadableMap icon) {
        view.setIconSource(icon);
    }

    @ReactProp(name = "showAsAction")
    public void setShowAsAction(BarButtonView view, Integer showAsAction) {
        view.setShowAsAction(showAsAction != null ? showAsAction : MenuItem.SHOW_AS_ACTION_NEVER);
    }

    @ReactProp(name = "search")
    public void setSearch(BarButtonView view, Boolean search) {
        view.setSearch(search != null ? search : false);
    }

    @ReactProp(name = "showActionView")
    public void setShowActionView(BarButtonView view, boolean showActionView) {
        view.setShowActionView(showActionView);
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
