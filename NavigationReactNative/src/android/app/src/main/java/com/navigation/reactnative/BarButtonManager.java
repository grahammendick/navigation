package com.navigation.reactnative;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;


public class BarButtonManager extends ViewGroupManager<BarButtonView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVBarButton";
    }

    @Nonnull
    @Override
    protected BarButtonView createViewInstance(ThemedReactContext reactContext) {
        return new BarButtonView(reactContext);
    }

    @ReactProp(name = "show")
    public void setShow(BarButtonView view, String show) {
        view.setShow(show);
    }

    @ReactProp(name = "title")
    public void setTitle(BarButtonView view, String title) {
        view.setTitle(title);
    }

    @ReactProp(name = "icon")
    public void setIcon(BarButtonView view, ReadableMap icon) {
        view.setIcon(icon);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onPress", MapBuilder.of("registrationName", "onPress"))
                .build();
    }
}
