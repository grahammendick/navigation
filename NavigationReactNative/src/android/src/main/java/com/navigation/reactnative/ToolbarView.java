package com.navigation.reactnative;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageButton;

import androidx.annotation.Nullable;
import androidx.appcompat.view.menu.ActionMenuItemView;
import androidx.appcompat.widget.ActionMenuView;
import androidx.appcompat.widget.Toolbar;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.appbar.AppBarLayout;

public class ToolbarView extends Toolbar {
    private MenuItem searchMenuItem;
    private Integer tintColor;
    private ImageButton collapseSearchButton;
    private OnSearchListener onSearchAddedListener;
    private static final String PROP_ACTION_ICON = "image";
    private static final String PROP_ACTION_SHOW = "show";
    private static final String PROP_ACTION_TITLE = "title";
    private static final String PROP_ACTION_SEARCH = "search";
    int defaultTitleTextColor;
    Drawable defaultOverflowIcon;
    private Integer defaultMenuTintColor;
    private IconResolver.IconResolverListener logoResolverListener;
    private IconResolver.IconResolverListener navIconResolverListener;
    private IconResolver.IconResolverListener overflowIconResolverListener;
    private boolean layoutRequested = false;

    public ToolbarView(Context context) {
        super(context);
        setLayoutParams(new AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.MATCH_PARENT));
        defaultTitleTextColor = getDefaultTitleTextColor();
        defaultOverflowIcon = getOverflowIcon();
        logoResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                setLogo(d);
                setTintColor(getLogo());
            }
        };
        navIconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                setNavigationIcon(d);
                setTintColor(getNavigationIcon());
            }
        };
        overflowIconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                setOverflowIcon(d);
                setTintColor(getOverflowIcon());
            }
        };
        setNavigationOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onNavigationPress", null);
            }
        });
        setOnMenuItemClickListener(new Toolbar.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                WritableMap event = Arguments.createMap();
                event.putInt("position", item.getOrder());
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onActionSelected", event);
                return true;
            }
        });
    }

    private int getDefaultTitleTextColor() {
        Resources.Theme theme = getContext().getTheme();
        TypedArray toolbarStyle = theme.obtainStyledAttributes(new int[] {getIdentifier(getContext(), "toolbarStyle")});
        int toolbarStyleResId = toolbarStyle.getResourceId(0, 0);
        toolbarStyle.recycle();
        TypedArray textAppearances = theme.obtainStyledAttributes(toolbarStyleResId, new int[] {getIdentifier(getContext(), "titleTextAppearance")});
        int titleTextAppearanceResId = textAppearances.getResourceId(0, 0);
        textAppearances.recycle();
        TypedArray titleTextAppearance = theme.obtainStyledAttributes(titleTextAppearanceResId, new int[]{android.R.attr.textColor});
        int titleTextColor = titleTextAppearance.getColor(0, Color.BLACK);
        titleTextAppearance.recycle();
        return titleTextColor;
    }

    private static int getIdentifier(Context context, String name) {
        return context.getResources().getIdentifier(name, "attr", context.getPackageName());
    }

    void setLogoSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, logoResolverListener, getContext());
    }

    void setNavIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, navIconResolverListener, getContext());
    }

    void setOverflowIconSource(@Nullable ReadableMap source) {
        if (source != null)
            IconResolver.setIconSource(source, overflowIconResolverListener, getContext());
        else
            setOverflowIcon(defaultOverflowIcon);
    }

    void setTintColor(Integer tintColor) {
        this.tintColor = tintColor;
        setTintColor(getNavigationIcon());
        setTintColor(getLogo());
        setTintColor(getOverflowIcon());
        setMenuTintColor();
        for(int i = 0; i < getMenu().size(); i++) {
            setTintColor(getMenu().getItem(i).getIcon());
        }
        setCollapseSearchTintColor();
    }

    private void setTintColor(Drawable icon) {
        if (icon != null) {
            if (tintColor != null)
                icon.setColorFilter(tintColor, PorterDuff.Mode.SRC_IN);
            else
                icon.clearColorFilter();
        }
    }

    void setMenuItems(@Nullable ReadableArray menuItems) {
        getMenu().clear();
        for (int i = 0; menuItems != null && i < menuItems.size(); i++) {
            ReadableMap menuItemProps = menuItems.getMap(i);
            if (menuItemProps == null)
                continue;
            String title = menuItemProps.hasKey(PROP_ACTION_TITLE) ? menuItemProps.getString(PROP_ACTION_TITLE) : "";
            ReadableMap iconSource = menuItemProps.getMap(PROP_ACTION_ICON);
            MenuItem menuItem = getMenu().add(Menu.NONE, Menu.NONE, i, title);
            if (iconSource != null)
                setMenuItemIcon(menuItem, iconSource);
            int showAsAction = menuItemProps.hasKey(PROP_ACTION_SHOW) ? menuItemProps.getInt(PROP_ACTION_SHOW) : MenuItem.SHOW_AS_ACTION_NEVER;
            boolean search = menuItemProps.hasKey(PROP_ACTION_SEARCH) && menuItemProps.getBoolean(PROP_ACTION_SEARCH);
            if (search) {
                searchMenuItem = menuItem;
                showAsAction = MenuItem.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW | showAsAction;
                if (onSearchAddedListener != null)
                    onSearchAddedListener.onSearchAdd(searchMenuItem);
                menuItem.setOnActionExpandListener(new MenuItem.OnActionExpandListener() {
                    @Override
                    public boolean onMenuItemActionCollapse(MenuItem item) {
                        onSearchAddedListener.onSearchCollapse();
                        return true;
                    }

                    @Override
                    public boolean onMenuItemActionExpand(MenuItem item) {
                        onSearchAddedListener.onSearchExpand();
                        return true;
                    }
                });
            }
            menuItem.setShowAsAction(showAsAction);
        }
        setMenuTintColor();
    }

    private void setMenuTintColor()  {
        for (int i = 0; i < getChildCount(); i++) {
            if (getChildAt(i) instanceof ActionMenuView) {
                ActionMenuView menu = (ActionMenuView) getChildAt(i);
                for(int j = 0; j < menu.getChildCount(); j++) {
                    if (menu.getChildAt(j) instanceof ActionMenuItemView) {
                        ActionMenuItemView menuItem = (ActionMenuItemView) menu.getChildAt(j);
                        if (defaultMenuTintColor == null)
                            defaultMenuTintColor = menuItem.getCurrentTextColor();
                        menuItem.setTextColor(tintColor != null ? tintColor : defaultMenuTintColor);
                    }
                }
            }
        }
    }

    private void setMenuItemIcon(final MenuItem item, ReadableMap iconSource) {
        ActionIconControllerListener controllerListener = new ActionIconControllerListener(item);
        IconResolver.setIconSource(iconSource, controllerListener, getContext());
    }

    void setOnSearchListener(OnSearchListener onSearchListener) {
        this.onSearchAddedListener = onSearchListener;
        if (searchMenuItem != null)
            this.onSearchAddedListener.onSearchAdd(searchMenuItem);

    }

    void setCollapseSearchButton(ImageButton collapseSearchButton) {
        this.collapseSearchButton = collapseSearchButton;
        setCollapseSearchTintColor();
    }

    void setCollapseSearchTintColor() {
        if (collapseSearchButton != null) {
            if (tintColor != null)
                collapseSearchButton.setColorFilter(tintColor);
            else
                collapseSearchButton.clearColorFilter();
        }
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        if (!layoutRequested) {
            layoutRequested = true;
            post(measureAndLayout);
        }
    }

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            layoutRequested = false;
            measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };

    class ActionIconControllerListener implements IconResolver.IconResolverListener {
        private final MenuItem item;

        ActionIconControllerListener(MenuItem item) {
            this.item = item;
        }

        @Override
        public void setDrawable(Drawable d) {
            item.setIcon(d);
            setTintColor(item.getIcon());
        }
    }

    interface OnSearchListener {
        void onSearchAdd(MenuItem searchMenuItem);
        void onSearchExpand();
        void onSearchCollapse();
    }
}
