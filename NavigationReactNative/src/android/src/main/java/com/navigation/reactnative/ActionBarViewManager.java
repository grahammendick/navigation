package com.navigation.reactnative;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ReactStylesDiffMap;
import com.facebook.react.uimanager.StateWrapper;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.NVActionBarManagerDelegate;
import com.facebook.react.viewmanagers.NVActionBarManagerInterface;

import java.util.Map;

public class ActionBarViewManager extends ViewGroupManager<ActionBarView> implements NVActionBarManagerInterface<ActionBarView> {
    private final ViewManagerDelegate<ActionBarView> delegate;

    public ActionBarViewManager() {
        delegate = new NVActionBarManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<ActionBarView> getDelegate() {
        return delegate;
    }

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
            .put("topExpanded", MapBuilder.of("registrationName", "onExpanded"))
            .put("topCollapsed", MapBuilder.of("registrationName", "onCollapsed"))
            .build();
    }

    @Override
    public Object updateState(
            ActionBarView view, ReactStylesDiffMap props, StateWrapper stateWrapper) {
        view.setStateWrapper(stateWrapper);
        return null;
    }
}
