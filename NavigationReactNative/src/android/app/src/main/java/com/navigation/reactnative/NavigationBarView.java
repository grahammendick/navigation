package com.navigation.reactnative;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewOutlineProvider;

import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.view.DraweeHolder;
import com.facebook.drawee.view.MultiDraweeHolder;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.appbar.AppBarLayout;

import androidx.annotation.Nullable;
import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar;

public class NavigationBarView extends AppBarLayout {
    class ActionIconControllerListener extends IconResolver.IconControllerListener {
        private final MenuItem item;

        ActionIconControllerListener(MenuItem item, DraweeHolder holder) {
            super(holder);
            this.item = item;
        }

        @Override
        protected void setDrawable(Drawable d) {
            item.setIcon(d);
            NavigationBarView.this.requestLayout();
        }
    }

    private IconResolver iconResolver;

    Toolbar toolbar;

    int defaultTitleTextColor;
    ViewOutlineProvider defaultOutlineProvider;
    Drawable defaultBackground;
    Drawable defaultOverflowIcon;

    private final DraweeHolder logoHolder = DraweeHolder.create(createDraweeHierarchy(), getContext());
    private final DraweeHolder navIconHolder = DraweeHolder.create(createDraweeHierarchy(), getContext());
    private final DraweeHolder overflowIconHolder = DraweeHolder.create(createDraweeHierarchy(), getContext());

    private IconResolver.IconControllerListener logoControllerListener;
    private IconResolver.IconControllerListener navIconControllerListener;
    private IconResolver.IconControllerListener overflowIconControllerListener;
    private final MultiDraweeHolder<GenericDraweeHierarchy> actionsHolder =
            new MultiDraweeHolder<>();

    public NavigationBarView(Context context) {
        super(context);

        toolbar = new Toolbar(context);
        addView(toolbar, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

        defaultTitleTextColor = getDefaultTitleTextColor();
        defaultOverflowIcon = toolbar.getOverflowIcon();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            defaultOutlineProvider = getOutlineProvider();
        }
        defaultBackground = getBackground();

        iconResolver = new IconResolver(context);
        logoControllerListener = new IconResolver.IconControllerListener(logoHolder) {
            @Override
            protected void setDrawable(Drawable d) {
                toolbar.setLogo(d);
            }
        };
        navIconControllerListener = new IconResolver.IconControllerListener(navIconHolder) {
            @Override
            protected void setDrawable(Drawable d) {
                toolbar.setNavigationIcon(d);
            }
        };
        overflowIconControllerListener = new IconResolver.IconControllerListener(overflowIconHolder) {
            @Override
            protected void setDrawable(Drawable d) {
                toolbar.setOverflowIcon(d);
            }
        };
        toolbar.setNavigationOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onNavigationPress", null);
            }
        });
        toolbar.setOnMenuItemClickListener(new Toolbar.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                WritableMap event = Arguments.createMap();
                event.putInt("position", item.getOrder());
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class)
                        .receiveEvent(getId(),"onActionSelected", event);
                return true;
            }
        });
    }

    @Override
    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        detachDraweeHolders();
    }

    @Override
    public void onStartTemporaryDetach() {
        super.onStartTemporaryDetach();
        detachDraweeHolders();
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        attachDraweeHolders();
    }

    @Override
    public void onFinishTemporaryDetach() {
        super.onFinishTemporaryDetach();
        attachDraweeHolders();
    }

    void setLogoSource(@Nullable ReadableMap source) {
        iconResolver.setIconSource(source, logoControllerListener, logoHolder);
    }

    void setNavIconSource(@Nullable ReadableMap source) {
        iconResolver.setIconSource(source, navIconControllerListener, navIconHolder);
    }

    void setOverflowIconSource(@Nullable ReadableMap source) {
        if (source != null)
            iconResolver.setIconSource(source, overflowIconControllerListener, overflowIconHolder);
        else
            toolbar.setOverflowIcon(defaultOverflowIcon);
    }

    private void detachDraweeHolders() {
        logoHolder.onDetach();
        navIconHolder.onDetach();
        overflowIconHolder.onDetach();
        actionsHolder.onDetach();
    }

    private void attachDraweeHolders() {
        logoHolder.onAttach();
        navIconHolder.onAttach();
        overflowIconHolder.onAttach();
        actionsHolder.onAttach();
    }

    private static final String PROP_ACTION_ICON = "image";
    private static final String PROP_ACTION_SHOW = "show";
    private static final String PROP_ACTION_TITLE = "title";
    private static final String PROP_ACTION_SEARCH = "search";

    void setMenuItems(@Nullable ReadableArray menuItems) {
        toolbar.getMenu().clear();
        actionsHolder.clear();
        for (int i = 0; menuItems != null && i < menuItems.size(); i++) {
            ReadableMap menuItemProps = menuItems.getMap(i);
            if (menuItemProps == null)
                continue;
            String title = menuItemProps.hasKey(PROP_ACTION_TITLE) ? menuItemProps.getString(PROP_ACTION_TITLE) : "";
            ReadableMap iconSource = menuItemProps.getMap(PROP_ACTION_ICON);
            MenuItem menuItem = toolbar.getMenu().add(Menu.NONE, Menu.NONE, i, title);
            if (iconSource != null)
                setMenuItemIcon(menuItem, iconSource);
            int showAsAction = menuItemProps.hasKey(PROP_ACTION_SHOW) ? menuItemProps.getInt(PROP_ACTION_SHOW) : MenuItem.SHOW_AS_ACTION_NEVER;
            boolean search = menuItemProps.hasKey(PROP_ACTION_SEARCH) && menuItemProps.getBoolean(PROP_ACTION_SEARCH);
            if (search) {
                SearchView searchView = new SearchView(getContext());
                menuItem.setActionView(searchView);
                showAsAction = MenuItem.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW | showAsAction;
                menuItem.setOnActionExpandListener(new MenuItem.OnActionExpandListener() {
                    @Override
                    public boolean onMenuItemActionCollapse(MenuItem item) {
                        requestLayout();
                        return true;
                    }
                    @Override
                    public boolean onMenuItemActionExpand(MenuItem item) {
                        requestLayout();
                        return true;
                    }
                });
                searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
                    @Override
                    public boolean onQueryTextSubmit(String query) {
                        return false;
                    }

                    @Override
                    public boolean onQueryTextChange(String newText) {
                        return false;
                    }
                });
            }
            menuItem.setShowAsAction(showAsAction);
        }
    }

    private void setMenuItemIcon(final MenuItem item, ReadableMap iconSource) {
        DraweeHolder<GenericDraweeHierarchy> holder =
                DraweeHolder.create(createDraweeHierarchy(), getContext());
        ActionIconControllerListener controllerListener = new ActionIconControllerListener(item, holder);
        controllerListener.setIconImageInfo(iconResolver.getIconImageInfo(iconSource));
        iconResolver.setIconSource(iconSource, controllerListener, holder);
        actionsHolder.add(holder);
    }

    private GenericDraweeHierarchy createDraweeHierarchy() {
        return new GenericDraweeHierarchyBuilder(getContext().getResources())
                .setActualImageScaleType(ScalingUtils.ScaleType.FIT_CENTER)
                .setFadeDuration(0)
                .build();
    }

    private final Runnable mLayoutRunnable = new Runnable() {
        @Override
        public void run() {
            measure(
                    MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(mLayoutRunnable);
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
}
