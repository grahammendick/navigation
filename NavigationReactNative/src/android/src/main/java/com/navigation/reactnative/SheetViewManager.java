package com.navigation.reactnative;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.NVSheetManagerDelegate;
import com.facebook.react.viewmanagers.NVSheetManagerInterface;

import java.util.Map;

public class SheetViewManager extends ViewGroupManager<SheetView> implements NVSheetManagerInterface<SheetView> {
    private final ViewManagerDelegate<SheetView> delegate;

    public SheetViewManager() {
        delegate = new NVSheetManagerDelegate<>(this);
    }

    @Nullable
    @Override
    public ViewManagerDelegate<SheetView> getDelegate() {
        return delegate;
    }

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

    @Override
    public void setDetent(SheetView view, @Nullable String detent) {
        view.pendingDetent = Integer.parseInt(detent);
    }

    @Override
    public void setFragmentTag(SheetView view, @Nullable String fragmentTag) {
        view.fragmentTag = fragmentTag;
    }

    @Override
    public void setAncestorFragmentTags(SheetView view, @Nullable ReadableArray ancestorFragmentTags) {
        view.ancestorFragmentTags = ancestorFragmentTags;
    }

    @Override
    public void setCrumb(SheetView view, int crumb) {
        view.crumb = crumb;
    }

    @Override
    public void setMostRecentEventCount(SheetView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
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
