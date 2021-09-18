package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class BottomAppBarManager extends ViewGroupManager<BottomAppBarView> {
    @NonNull
    @Override
    public String getName() {
        return "NVBottomAppBar";
    }

    @NonNull
    @Override
    protected BottomAppBarView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new BottomAppBarView(reactContext);
    }

    @ReactProp(name = "height")
    public void setHeight(BottomAppBarView view, double height) {
        view.getLayoutParams().height = (int) PixelUtil.toPixelFromDIP(height);
    }
}
