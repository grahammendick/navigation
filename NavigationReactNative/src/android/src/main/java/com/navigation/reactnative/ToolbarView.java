package com.navigation.reactnative;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.BlendMode;
import android.graphics.BlendModeColorFilter;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.text.SpannableString;
import android.text.style.AbsoluteSizeSpan;
import android.text.style.StyleSpan;
import android.text.style.TypefaceSpan;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewParent;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.ActionMenuView;
import androidx.appcompat.widget.AppCompatImageButton;
import androidx.appcompat.widget.AppCompatImageView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.text.ReactFontManager;
import com.facebook.react.views.text.ReactTypefaceUtils;
import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.appbar.MaterialToolbar;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Objects;

public class ToolbarView extends MaterialToolbar implements ActionView, DrawerToggleHandler {
    private MenuItem searchMenuItem;
    int crumb;
    boolean autoNavigation;
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
    private Drawable navigationIcon;
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
        logoResolverListener = d -> {
            setLogo(d);
            setTintColor(getLogo());
        };
        navIconResolverListener = d -> {
            navigationIcon = d;
            setNavigationIcon(d);
            setTintColor(getNavigationIcon());
            setTestID();
        };
        overflowIconResolverListener = d -> {
            setOverflowIcon(d);
            setTintColor(getOverflowIcon());
        };
        setNavigationOnClickListener(this::onNavigationClick);
        setOnMenuItemClickListener(item -> {
            for (int i = 0; i < children.size(); i++) {
                if (children.get(i) instanceof BarButtonView barButtonView) {
                    if (barButtonView.getMenuItem() != item)
                        barButtonView.getMenuItem().collapseActionView();
                    else
                        barButtonView.press();
                }
            }
            return true;
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
            int defaultTintColor = getNavigationIconTint() != null ? getNavigationIconTint() : Color.BLACK;
            icon.setColorFilter(new BlendModeColorFilter(tintColor != null ? tintColor : defaultTintColor, BlendMode.SRC_IN));
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
        HashMap<Integer, String> testIDs = new HashMap<>();
        for (int i = 0; i < children.size(); i++) {
            if (children.get(i) instanceof BarButtonView barButton) {
                MenuItem menuItem = getMenu().add(Menu.NONE, barButton.getId(), i, "");
                barButton.setMenuItem(menuItem);
                testIDs.put(barButton.getId(), barButton.testID);
                if (barButton.getSearch()) {
                    searchMenuItem = menuItem;
                    if (onSearchAddedListener != null)
                        onSearchAddedListener.onSearchAdd(searchMenuItem);
                    menuItem.setOnActionExpandListener(new MenuItem.OnActionExpandListener() {
                        @Override
                        public boolean onMenuItemActionCollapse(@NonNull MenuItem item) {
                            onSearchAddedListener.onSearchCollapse();
                            return true;
                        }

                        @Override
                        public boolean onMenuItemActionExpand(@NonNull MenuItem item) {
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

    private void setMenuTintColor(HashMap<Integer, String> testIDs)  {
        for (int i = 0; i < getChildCount(); i++) {
            if (getChildAt(i) instanceof ActionMenuView menu) {
                for (int j = 0; j < menu.getChildCount(); j++) {
                    if (menu.getChildAt(j) instanceof TextView menuItemView) {
                        if (defaultMenuTintColor == null)
                            defaultMenuTintColor = menuItemView.getCurrentTextColor();
                        menuItemView.setTextColor(tintColor != null ? tintColor : defaultMenuTintColor);
                        if (testIDs != null) {
                            menuItemView.setTag(testIDs.get(menuItemView.getId()));
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
            if (child instanceof ActionMenuView menu) {
                for (int j = 0; j < menu.getChildCount(); j++) {
                    if (menu.getChildAt(j) instanceof AppCompatImageView overflowButton) {
                        overflowButton.setTag(overflowTestID);
                    }
                }
            }
        }
    }

    void onAfterUpdateTransaction() {
        AppCompatActivity activity = (AppCompatActivity) ((ReactContext) getContext()).getCurrentActivity();
        assert activity != null;
        if (autoNavigation) {
            if (crumb > 0) {
                activity.setSupportActionBar(this);
                assert activity.getSupportActionBar() != null;
                activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
                activity.setSupportActionBar(null);
                setNavigationOnClickListener(this::onNavigationClick);
            } else {
                registerDrawerToggleHandler();
            }
        } else {
            setNavigationIcon(navigationIcon);
            setNavigationOnClickListener(this::onNavigationClick);
        }
        setTintColor(getNavigationIcon());
        setTestID();
        if (titleChanged) {
            SpannableString titleSpannable = null;
            if (title != null) {
                titleSpannable = new SpannableString(title);
                if (titleFontFamily != null){
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
                        titleSpannable.setSpan(new TypefaceSpan(ReactFontManager.getInstance().getTypeface(titleFontFamily, 0, getContext().getAssets())), 0, title.length(), 0);
                    else
                        titleSpannable.setSpan(new TypefaceSpan(titleFontFamily), 0, title.length(), 0);
                }
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

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (autoNavigation && crumb == 0) registerDrawerToggleHandler();
    }

    private void registerDrawerToggleHandler() {
        ViewParent parent = this;
        while(parent != null) {
            parent = parent.getParent();
            if (parent instanceof SceneView sceneView) {
                sceneView.registerDrawerToggleHandler(this);
                parent = null;
            }
        }
    }

    private void onNavigationClick(View view) {
        ReactContext reactContext = (ReactContext) getContext();
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
        eventDispatcher.dispatchEvent(new NavigationPressEvent(getId()));
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

    private final Runnable measureAndLayout = () -> {
        layoutRequested = false;
        measure(
            MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
    };

    @Override
    public void initDrawerToggle(ActionBarDrawerToggle drawerToggle) {
        setTintColor(getNavigationIcon());
        setTestID();
    }

    static class NavigationPressEvent extends Event<ToolbarView.NavigationPressEvent> {
        public NavigationPressEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topNavigationPress";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), Arguments.createMap());
        }
    }
}
