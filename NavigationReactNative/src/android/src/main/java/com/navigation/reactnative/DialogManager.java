package com.navigation.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class DialogManager extends ViewGroupManager<DialogView> {
    @NonNull
    @Override
    public String getName() {
        return "NVDialog";
    }

    @NonNull
    @Override
    protected DialogView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new DialogView(themedReactContext);
    }
}
