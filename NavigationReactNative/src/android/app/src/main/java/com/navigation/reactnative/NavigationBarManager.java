package com.navigation.reactnative;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.view.MenuItem;
import android.view.View;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;

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

    @Override
    public int getChildCount(NavigationBarView parent) {
        return parent.toolbar.getChildCount();
    }

    @Override
    public View getChildAt(NavigationBarView parent, int index) {
        return parent.toolbar.getChildAt(index);
    }

    @Override
    public void addView(NavigationBarView parent, View child, int index) {
        Toolbar.LayoutParams layoutParams = new Toolbar.LayoutParams(
                Toolbar.LayoutParams.MATCH_PARENT,
                Toolbar.LayoutParams.MATCH_PARENT
        );
        parent.toolbar.addView(child, index, layoutParams);
        parent.toolbar.setContentInsetsRelative(0, 0);
    }

    @Override
    public void removeViewAt(NavigationBarView parent, int index) {
        parent.toolbar.removeViewAt(index);
        int[] insets = getDefaultContentInsets(parent.getContext());
        parent.toolbar.setContentInsetsRelative(insets[0], insets[1]);
    }

    @ReactProp(name = "title")
    public void setTitle(NavigationBarView view, @Nullable String title) {
        view.setTitle(title);
    }

    @ReactProp(name = "logo")
    public void setLogo(NavigationBarView view, @Nullable ReadableMap logo) {
        view.setLogoSource(logo);
    }

    @ReactProp(name = "navIcon")
    public void setNavIcon(NavigationBarView view, @Nullable ReadableMap navIcon) {
        view.setNavIconSource(navIcon);
    }

    @ReactProp(name = "overflowIcon")
    public void setOverflowIcon(NavigationBarView view, @Nullable ReadableMap overflowIcon) {
        view.setOverflowIconSource(overflowIcon);
    }

    @ReactProp(name = "menuItems")
    public void setMenuItems(NavigationBarView view, @Nullable ReadableArray menuItems) {
        view.setMenuItems(menuItems);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onIconClicked", MapBuilder.of("registrationName", "onIconClicked"))
                .put("onActionSelected", MapBuilder.of("registrationName", "onActionSelected"))
                .build();
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedViewConstants() {
        return MapBuilder.<String, Object>of(
                "ShowAsAction",
                MapBuilder.of(
                        "never", MenuItem.SHOW_AS_ACTION_NEVER,
                        "always", MenuItem.SHOW_AS_ACTION_ALWAYS,
                        "ifRoom", MenuItem.SHOW_AS_ACTION_IF_ROOM));
    }

    private int[] getDefaultContentInsets(Context context) {
        Resources.Theme theme = context.getTheme();
        TypedArray toolbarStyle = null;
        TypedArray contentInsets = null;

        try {
            toolbarStyle =
                    theme.obtainStyledAttributes(new int[] {getIdentifier(context, "toolbarStyle")});

            int toolbarStyleResId = toolbarStyle.getResourceId(0, 0);

            contentInsets =
                    theme.obtainStyledAttributes(
                            toolbarStyleResId,
                            new int[] {
                                    getIdentifier(context, "contentInsetStart"),
                                    getIdentifier(context, "contentInsetEnd"),
                            });

            int contentInsetStart = contentInsets.getDimensionPixelSize(0, 0);
            int contentInsetEnd = contentInsets.getDimensionPixelSize(1, 0);

            return new int[] {contentInsetStart, contentInsetEnd};
        } finally {
            recycleQuietly(toolbarStyle);
            recycleQuietly(contentInsets);
        }

    }

    private static void recycleQuietly(@Nullable TypedArray style) {
        if (style != null) {
            style.recycle();
        }
    }

    /**
     * The appcompat-v7 BUCK dep is listed as a provided_dep, which complains that
     * com.facebook.react.R doesn't exist. Since the attributes provided from a parent, we can access
     * those attributes dynamically.
     */
    private static int getIdentifier(Context context, String name) {
        return context.getResources().getIdentifier(name, "attr", context.getPackageName());
    }
}
