package com.navigation.reactnative;

import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

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

    @ReactProp(name = "expandedOffset")
    public void setExpandedOffset(DialogRootView view, int expandedOffset) {
        int offset = (int) PixelUtil.toPixelFromDIP(expandedOffset);
        view.setExpandedOffset(offset);
        view.setExpandedOffset(offset);
        view.requestLayout();
        if (view.getParent() != null)
            view.getParent().requestLayout();
    }

    @ReactProp(name = "sheetHeight")
    public void setSheetHeight(DialogRootView view, double sheetHeight) {
        view.setExpandedHeight(sheetHeight != 0 ? (int) PixelUtil.toPixelFromDIP(sheetHeight) : ViewGroup.LayoutParams.WRAP_CONTENT);
        view.requestLayout();
        if (view.getParent() != null)
            view.getParent().requestLayout();
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
