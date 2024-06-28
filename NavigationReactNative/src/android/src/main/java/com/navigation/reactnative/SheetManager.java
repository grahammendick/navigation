package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class SheetManager extends ViewGroupManager<SheetView> {
    @NonNull
    @Override
    public String getName() {
        return "NVSheet";
    }

    @NonNull
    @Override
    protected SheetView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new SheetView(themedReactContext);
    }

    @ReactProp(name = "detent")
    public void setDetent(SheetView view, String detent) {
        view.pendingDetent = Integer.parseInt(detent);
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(SheetView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
    }

    @ReactProp(name = "fragmentTag")
    public void setFragmentTag(SheetView view, String fragmentTag) {
        view.fragmentTag = fragmentTag;
    }

    @ReactProp(name = "ancestorFragmentTags")
    public void setAncestorFragmentTags(SheetView view, ReadableArray ancestorFragmentTags) {
        view.ancestorFragmentTags = ancestorFragmentTags;
    }

    @ReactProp(name = "crumb")
    public void setCrumb(SheetView view, int crumb) {
        view.crumb = crumb;
    }

    @Override
    protected void onAfterUpdateTransaction(@NonNull SheetView view) {
        super.onAfterUpdateTransaction(view);
        view.onAfterUpdateTransaction();
    }

    @Override
    public void onDropViewInstance(@NonNull SheetView view) {
        view.removeFragment();
        super.onDropViewInstance(view);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topDetentChanged", MapBuilder.of("registrationName", "onDetentChanged"))
            .put("topDismissed", MapBuilder.of("registrationName", "onDismissed"))
            .build();
    }

    @Override
    public void addView(SheetView parent, View child, int index) {
        parent.container = child;
        parent.onAfterUpdateTransaction();
    }

    @Override
    public void removeViewAt(SheetView parent, int index) {
        parent.container = null;
    }

    @Override
    public int getChildCount(SheetView parent) {
        return parent.container != null ? 1 : 0;
    }

    @Override
    public View getChildAt(SheetView parent, int index) {
        return parent.container;
    }
}
