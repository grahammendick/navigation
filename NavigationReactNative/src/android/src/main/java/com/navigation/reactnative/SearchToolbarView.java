package com.navigation.reactnative;

import android.content.Context;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageButton;

import androidx.annotation.Nullable;
import androidx.appcompat.view.menu.ActionMenuItemView;
import androidx.appcompat.view.menu.MenuView;
import androidx.appcompat.widget.ActionMenuView;
import androidx.appcompat.widget.AppCompatImageButton;
import androidx.appcompat.widget.AppCompatImageView;

import com.facebook.react.bridge.ReadableMap;
import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.search.SearchBar;

import java.util.ArrayList;
import java.util.HashMap;

public class SearchToolbarView extends SearchBar {
    private final IconResolver.IconResolverListener navIconResolverListener;
    final Drawable defaultBackground;
    private Integer tintColor;
    private Integer defaultMenuTintColor;
    final ArrayList<View> children = new ArrayList<>();

    public SearchToolbarView(Context context) {
        super(context);
        AppBarLayout.LayoutParams params = new AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT);
        params.setScrollFlags(AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL | AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS);
        setLayoutParams(params);
        defaultBackground = getBackground();
        navIconResolverListener = d -> {
            setNavigationIcon(d);
            setTintColor(getNavigationIcon());
            // setTestID();
        };
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        getParent().requestLayout();
    }

    void setNavIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, navIconResolverListener, getContext());
    }

    void setTintColor(Integer tintColor) {
        this.tintColor = tintColor;
        setTintColor(getNavigationIcon());
        setMenuTintColor(null);
    }

    private void setTintColor(Drawable icon) {
        if (icon != null) {
            if (tintColor != null)
                icon.setColorFilter(tintColor, PorterDuff.Mode.SRC_IN);
            else
                icon.clearColorFilter();
        }
    }

    void setMenuItems() {
        getMenu().clear();
        HashMap<MenuItem, String> testIDs = new HashMap<>();
        for (int i = 0; i < children.size(); i++) {
            if (children.get(i) instanceof BarButtonView) {
                BarButtonView barButton = (BarButtonView) children.get(i);
                MenuItem menuItem = getMenu().add(Menu.NONE, Menu.NONE, i, "");
                barButton.setMenuItem(menuItem);
                testIDs.put(menuItem, barButton.testID);
            }
        }
        setMenuTintColor(testIDs);
        // setTestID();
        requestLayout();
    }

    private void setMenuTintColor(HashMap<MenuItem, String> testIDs)  {
        for (int i = 0; i < getChildCount(); i++) {
            if (getChildAt(i) instanceof ActionMenuView) {
                ActionMenuView menu = (ActionMenuView) getChildAt(i);
                for (int j = 0; j < menu.getChildCount(); j++) {
                    if (menu.getChildAt(j) instanceof ActionMenuItemView) {
                        ActionMenuItemView menuItemView = (ActionMenuItemView) menu.getChildAt(j);
                        if (defaultMenuTintColor == null)
                            defaultMenuTintColor = menuItemView.getCurrentTextColor();
                        menuItemView.setTextColor(tintColor != null ? tintColor : defaultMenuTintColor);
                        if (testIDs != null) {
                            MenuItem menuItem = ((MenuView.ItemView) menuItemView).getItemData();
                            menuItemView.setTag(testIDs.get(menuItem));
                        }
                    }
                }
            }
        }
        for (int i = 0; i < children.size(); i++) {
            if (children.get(i) instanceof BarButtonView) {
                ((BarButtonView) children.get(i)).setTintColor(tintColor);
            }
        }
    }
}
