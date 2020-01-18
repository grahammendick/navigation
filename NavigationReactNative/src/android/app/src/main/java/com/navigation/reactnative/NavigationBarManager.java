package com.navigation.reactnative;

import android.graphics.Color;
import android.os.Build;
import android.view.MenuItem;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

import androidx.annotation.Nullable;

public class NavigationBarManager extends ViewGroupManager<NavigationBarView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVNavigationBar";
    }

    @Nonnull
    @Override
    protected NavigationBarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new NavigationBarView(reactContext);
    }

    @ReactProp(name = "barTintColor", customType = "Color")
    public void setBarTintColor(NavigationBarView view, @Nullable Integer barTintColor) {
        if (barTintColor != null) {
            view.setBackground(null);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                if (Color.alpha(barTintColor) < 255)
                    view.setOutlineProvider(null);
                else
                    view.setOutlineProvider(view.defaultOutlineProvider);
            }
        } else {
            view.setBackground(view.defaultBackground);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
                view.setOutlineProvider(view.defaultOutlineProvider);
        }
    }

    @ReactProp(name = "height")
    public void setHeight(NavigationBarView view, double height) {
        view.getLayoutParams().height = (int) PixelUtil.toPixelFromDIP(height);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("onNavigationPress", MapBuilder.of("registrationName", "onNavigationPress"))
            .put("onActionSelected", MapBuilder.of("registrationName", "onActionSelected"))
            .build();
    }

    @Override
    public Map<String, Object> getExportedViewConstants() {
        return MapBuilder.<String, Object>of(
            "ShowAsAction",
            MapBuilder.of(
                "never", MenuItem.SHOW_AS_ACTION_NEVER,
                "always", MenuItem.SHOW_AS_ACTION_ALWAYS,
                "ifRoom", MenuItem.SHOW_AS_ACTION_IF_ROOM));
    }
}
