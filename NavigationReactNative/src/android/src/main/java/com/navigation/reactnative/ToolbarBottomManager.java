package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class ToolbarBottomManager extends ViewGroupManager<ToolbarBottomView> {
    @NonNull
    @Override
    public String getName() {
        return "NVToolbarBottom";
    }

    @NonNull
    @Override
    protected ToolbarBottomView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new ToolbarBottomView(reactContext);
    }

    @ReactProp(name = "height")
    public void setHeight(ToolbarBottomView view, double height) {
        view.getLayoutParams().height = (int) PixelUtil.toPixelFromDIP(height);
    }
}
