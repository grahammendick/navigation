package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import java.util.Map;

public class ActionBarManager extends ViewGroupManager<ActionBarView> {
    @NonNull
    @Override
    public String getName() {
        return "NVActionBar";
    }

    @NonNull
    @Override
    protected ActionBarView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new ActionBarView(reactContext);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("onExpanded", MapBuilder.of("registrationName", "onExpanded"))
            .put("onCollapsed", MapBuilder.of("registrationName", "onCollapsed"))
            .build();
    }
}
