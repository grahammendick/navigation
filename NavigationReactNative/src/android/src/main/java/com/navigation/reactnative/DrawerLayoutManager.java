package com.navigation.reactnative;

import android.view.Gravity;

import androidx.annotation.NonNull;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class DrawerLayoutManager extends ViewGroupManager<DrawerLayoutView> {
    @NonNull
    @Override
    public String getName() {
        return "NVDrawerLayout";
    }

    @ReactProp(name = "open")
    public void setOpen(DrawerLayoutView view, boolean open) {
        view.pendingOpen = open;
    }

    @ReactProp(name = "fromRight")
    public void setFromRight(DrawerLayoutView view, boolean fromRight) {
        view.gravity = !fromRight ? Gravity.LEFT : Gravity.RIGHT;
        view.requestLayout();
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(DrawerLayoutView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull DrawerLayoutView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }

    @NonNull
    @Override
    protected DrawerLayoutView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new DrawerLayoutView(themedReactContext);
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topChangeOpen", MapBuilder.of("registrationName", "onChangeOpen"))
            .build();
    }
}
