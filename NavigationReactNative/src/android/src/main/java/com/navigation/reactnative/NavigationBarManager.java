package com.navigation.reactnative;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.MenuItem;

import androidx.annotation.NonNull;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.material.appbar.AppBarLayout;

import java.util.Map;

import javax.annotation.Nonnull;

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

    @ReactProp(name = "barTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBarTintColor(NavigationBarView view, int barTintColor) {
        if (barTintColor != Integer.MAX_VALUE) {
            view.setBackground(new ColorDrawable(barTintColor));
            if (Color.alpha(barTintColor) < 255)
                view.setOutlineProvider(null);
            else
                view.setOutlineProvider(view.defaultOutlineProvider);
        } else {
            view.setBackground(view.defaultBackground);
            view.setOutlineProvider(view.defaultOutlineProvider);
        }
    }

    @ReactProp(name = "shadowColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setShadowColor(@NonNull NavigationBarView view, int shadowColor) {
        super.setShadowColor(view, shadowColor != Integer.MAX_VALUE ? shadowColor : view.defaultShadowColor);
    }

    @ReactProp(name = "hide")
    public void setHide(NavigationBarView view, boolean hide) {
        view.setExpanded(!hide, true);
    }

    @ReactProp(name = "height")
    public void setHeight(NavigationBarView view, double height) {
        view.getLayoutParams().height = height != 0 ? (int) PixelUtil.toPixelFromDIP(height) : AppBarLayout.LayoutParams.WRAP_CONTENT;
        if (view.getParent() instanceof CoordinatorLayoutView) {
            CoordinatorLayoutView coordinatorLayoutView = (CoordinatorLayoutView) view.getParent();
            coordinatorLayoutView.requestLayout();
        }
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("topOnOffsetChanged", MapBuilder.of("registrationName", "onOffsetChanged"))
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
