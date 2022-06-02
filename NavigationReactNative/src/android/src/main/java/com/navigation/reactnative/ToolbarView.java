package com.navigation.reactnative;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.text.SpannableString;
import android.text.style.AbsoluteSizeSpan;
import android.text.style.StyleSpan;
import android.text.style.TypefaceSpan;
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
import androidx.appcompat.widget.Toolbar;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.text.ReactTypefaceUtils;
import com.google.android.material.appbar.AppBarLayout;

import java.util.ArrayList;
import java.util.HashMap;

public class ToolbarView extends Toolbar implements ActionView {
    private MenuItem searchMenuItem;
    private String title;
    private String titleFontFamily;
    private String titleFontWeight;
    private String titleFontStyle;
    private Integer titleFontSize;
    private boolean titleChanged = false;
    private Integer tintColor;
    private ImageButton collapseButton;
    private OnSearchListener onSearchAddedListener;
    final int defaultTitleTextColor;
    final Drawable defaultOverflowIcon;
    private Integer defaultMenuTintColor;
    private String navigationTestID;
    private String overflowTestID;
    private final IconResolver.IconResolverListener logoResolverListener;
    private final IconResolver.IconResolverListener navIconResolverListener;
    private final IconResolver.IconResolverListener overflowIconResolverListener;
    private boolean layoutRequested = false;
    final ArrayList<View> children = new ArrayList<>();

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
                setTestID();
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
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
                eventDispatcher.dispatchEvent(new ToolbarView.NavigationPressEvent(getId()));
            }
        });
        setOnMenuItemClickListener(new OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                for (int i = 0; i < children.size(); i++) {
                    if (children.get(i) instanceof BarButtonView) {
                        BarButtonView barButtonView = (BarButtonView) children.get(i);
                        if (barButtonView.getMenuItem() != item)
                            barButtonView.getMenuItem().collapseActionView();
                        else
                            barButtonView.press();
                    }
                }
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

    void setPlainTitle(String title) {
        this.title = title;
        titleChanged = true;
    }

    void setTitleFontFamily(String titleFontFamily) {
        this.titleFontFamily = titleFontFamily;
        titleChanged = true;
    }

    void setTitleFontWeight(String titleFontWeight) {
        this.titleFontWeight = titleFontWeight;
        titleChanged = true;
    }

    void setTitleFontStyle(String titleFontStyle) {
        this.titleFontStyle = titleFontStyle;
        titleChanged = true;
    }

    void setTitleFontSize(Integer titleFontSize) {
        this.titleFontSize = titleFontSize;
        titleChanged = true;
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
        setMenuTintColor(null);
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

    void setNavigationTestID(String navigationTestID) {
        this.navigationTestID = navigationTestID;
        setTestID();
    }

    void setOverflowTestID(String overflowTestID) {
        this.overflowTestID = overflowTestID;
        setTestID();
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
                if (barButton.getSearch()) {
                    searchMenuItem = menuItem;
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
                            ((NavigationBarView) getParent()).setExpanded(true);
                            return true;
                        }
                    });
                }
            }
        }
        setMenuTintColor(testIDs);
        setTestID();
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

    private void setTestID() {
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            if (child instanceof AppCompatImageButton) {
                child.setTag(navigationTestID);
            }
            if (child instanceof ActionMenuView) {
                ActionMenuView menu = (ActionMenuView) child;
                for (int j = 0; j < menu.getChildCount(); j++) {
                    if (menu.getChildAt(j) instanceof AppCompatImageView) {
                        AppCompatImageView overflowButton = (AppCompatImageView) menu.getChildAt(j);
                        overflowButton.setTag(overflowTestID);
                    }
                }
            }
        }
    }

    void styleTitle() {
        if (titleChanged) {
            SpannableString titleSpannable = null;
            if (title != null) {
                titleSpannable = new SpannableString(title);
                if (titleFontFamily != null)
                    titleSpannable.setSpan(new TypefaceSpan(titleFontFamily), 0, title.length(), 0);
                if (titleFontWeight != null)
                    titleSpannable.setSpan(new StyleSpan(ReactTypefaceUtils.parseFontWeight(titleFontWeight)), 0, title.length(), 0);
                if (titleFontStyle != null)
                    titleSpannable.setSpan(new StyleSpan(ReactTypefaceUtils.parseFontStyle(titleFontStyle)), 0, title.length(), 0);
                if (titleFontSize != null)
                    titleSpannable.setSpan(new AbsoluteSizeSpan(titleFontSize, true), 0, title.length(), 0);
            }
            setTitle(titleSpannable);
            titleChanged = false;
        }
    }

    public void setOnSearchListener(OnSearchListener onSearchListener) {
        this.onSearchAddedListener = onSearchListener;
        if (searchMenuItem != null)
            this.onSearchAddedListener.onSearchAdd(searchMenuItem);

    }

    public void setCollapseButton(ImageButton collapseButton) {
        this.collapseButton = collapseButton;
        setCollapseSearchTintColor();
    }

    void setCollapseSearchTintColor() {
        if (collapseButton != null) {
            if (tintColor != null)
                collapseButton.setColorFilter(tintColor);
            else
                collapseButton.clearColorFilter();
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

    static class NavigationPressEvent extends Event<ToolbarView.NavigationPressEvent> {
        public NavigationPressEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topOnNavigationPress";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
        }
    }
}
