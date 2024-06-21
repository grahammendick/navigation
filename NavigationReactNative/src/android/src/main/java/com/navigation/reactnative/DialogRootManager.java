package com.navigation.reactnative;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.ViewGroupManager;

import java.util.Map;

public class DialogRootManager extends ViewGroupManager<DialogRootView> {
    @NonNull
    @Override
    public String getName() {
        return "NVDialogRoot";
    }

    @NonNull
    @Override
    protected DialogRootView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new DialogRootView(themedReactContext);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("topShowChanged", MapBuilder.of("registrationName", "onShowChanged"))
                .build();
    }
    @Override
    protected void addEventEmitters(@NonNull ThemedReactContext reactContext, @NonNull DialogRootView view) {
        super.addEventEmitters(reactContext, view);
        view.eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, view.getId());
    }
}
