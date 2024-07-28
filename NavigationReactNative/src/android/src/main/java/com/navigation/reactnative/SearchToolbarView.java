package com.navigation.reactnative;

import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.ColorStateList;
import android.graphics.BlendMode;
import android.graphics.BlendModeColorFilter;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.RippleDrawable;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.graphics.drawable.DrawerArrowDrawable;
import androidx.appcompat.widget.ActionMenuView;
import androidx.appcompat.widget.AppCompatImageButton;
import androidx.appcompat.widget.AppCompatImageView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.text.ReactTypefaceUtils;
import com.google.android.material.R;
import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.color.MaterialColors;
import com.google.android.material.search.SearchBar;
import com.google.android.material.shape.MaterialShapeDrawable;

import java.util.ArrayList;
import java.util.HashMap;

public class SearchToolbarView extends SearchBar implements DrawerToggleHandler {
    int crumb;
    boolean autoNavigation;
    boolean settingHomeAsUp = false;
    final Drawable defaultBackground;
    private Integer tintColor;
    private Integer defaultMenuTintColor;
    final Drawable defaultOverflowIcon;
    private String navigationTestID;
    private String overflowTestID;
    private String fontFamily;
    private String fontWeight;
    private String fontStyle;
    private Integer fontSize;
    private boolean placeholderFontChanged = false;
    private final Typeface defaultTypeface;
    private final float defaultFontSize;
    final Drawable searchDefaultNavigationIcon;
    Drawable defaultNavigationIcon;
    private Drawable navigationIcon;
    private final IconResolver.IconResolverListener navIconResolverListener;
    private final IconResolver.IconResolverListener overflowIconResolverListener;
    final ArrayList<BarButtonView> children = new ArrayList<>();

    public SearchToolbarView(Context context) {
        super(context);
        AppBarLayout.LayoutParams params = new AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT);
        params.setScrollFlags(AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL | AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS);
        setLayoutParams(params);
        defaultBackground = getBackground();
        defaultTypeface = getTextView().getTypeface();
        defaultFontSize = PixelUtil.toDIPFromPixel(getTextView().getTextSize());
        defaultOverflowIcon = getOverflowIcon();
        defaultNavigationIcon = searchDefaultNavigationIcon = getNavigationIcon();
        navIconResolverListener = d -> {
            navigationIcon = d;
            setNavigationIcon(d != null ? d : defaultNavigationIcon);
            setTintColor(getNavigationIcon());
            setTestID();
        };
        overflowIconResolverListener = d -> {
            setOverflowIcon(d);
            setTintColor(getOverflowIcon());
        };
        setOnMenuItemClickListener(item -> {
            for (int i = 0; i < children.size(); i++) {
                if (children.get(i).getMenuItem() == item)
                    children.get(i).press();
            }
            return true;
        });
    }

    void setFontFamily(String fontFamily) {
        this.fontFamily = fontFamily;
        placeholderFontChanged = true;
    }

    void setFontWeight(String fontWeight) {
        this.fontWeight = fontWeight;
        placeholderFontChanged = true;
    }

    void setFontStyle(String fontStyle) {
        this.fontStyle = fontStyle;
        placeholderFontChanged = true;
    }

    void setFontSize(Integer fontSize) {
        this.fontSize = fontSize;
        placeholderFontChanged = true;
    }

    void stylePlaceholder() {
        if (placeholderFontChanged) {
            if (fontFamily != null || fontWeight != null || fontStyle != null)
                getTextView().setTypeface(ReactTypefaceUtils.applyStyles(defaultTypeface, ReactTypefaceUtils.parseFontStyle(fontStyle), ReactTypefaceUtils.parseFontWeight(fontWeight), fontFamily, getContext().getAssets()));
            else
                getTextView().setTypeface(defaultTypeface);
            getTextView().setTextSize(fontSize != null ? fontSize : defaultFontSize);
            placeholderFontChanged = false;
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (autoNavigation && crumb == 0) registerDrawerToggleHandler();
        getParent().requestLayout();
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
        setTintColor(getOverflowIcon());
        setMenuTintColor(null);
    }

    private void setTintColor(Drawable icon) {
        if (icon != null) {
            if (tintColor != null)
                icon.setColorFilter(new BlendModeColorFilter(tintColor, BlendMode.SRC_IN));
            else
                icon.clearColorFilter();
        }
    }

    void setBarTintColor(int barTintColor) {
        Drawable drawable = defaultBackground;
        if (defaultBackground instanceof RippleDrawable)
            drawable = ((RippleDrawable) defaultBackground).getDrawable(0);
        if (drawable instanceof MaterialShapeDrawable && drawable.getConstantState() != null) {
            drawable = drawable.getConstantState().newDrawable();
            ((MaterialShapeDrawable) drawable).setFillColor(ColorStateList.valueOf(barTintColor));
            setBackground(drawable);
        }
    }

    void setMenuItems() {
        getMenu().clear();
        HashMap<Integer, String> testIDs = new HashMap<>();
        for (int i = 0; i < children.size(); i++) {
            BarButtonView barButton = children.get(i);
            MenuItem menuItem = getMenu().add(Menu.NONE, barButton.getId(), i, "");
            barButton.setMenuItem(menuItem);
            testIDs.put(barButton.getId(), barButton.testID);
        }
        setMenuTintColor(testIDs);
        setTestID();
        requestLayout();
    }

    void onAfterUpdateTransaction() {
        ReactContext reactContext = (ReactContext) ((ContextWrapper) getContext()).getBaseContext();
        AppCompatActivity activity = (AppCompatActivity) reactContext.getCurrentActivity();
        assert activity != null;
        if (autoNavigation) {
            if (crumb > 0) {
                settingHomeAsUp = true;
                activity.setSupportActionBar(this);
                assert activity.getSupportActionBar() != null;
                activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
                settingHomeAsUp = false;
                defaultNavigationIcon = getNavigationIcon();
                activity.setSupportActionBar(null);
                addNavigationListener();
            } else {
                registerDrawerToggleHandler();
            }
        } else {
            defaultNavigationIcon = searchDefaultNavigationIcon;
            setNavigationIcon(navigationIcon != null ? navigationIcon : defaultNavigationIcon);
            addNavigationListener();
        }
        setTintColor(getNavigationIcon());
        setTestID();
        stylePlaceholder();
    }

    @Nullable
    @Override
    public Drawable getNavigationIcon() {
        return (!settingHomeAsUp || super.getNavigationIcon() != defaultNavigationIcon) ? super.getNavigationIcon() : null;
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
    void addNavigationListener() {
        setNavigationOnClickListener(view -> {
            ReactContext reactContext = (ReactContext) ((ContextWrapper) getContext()).getBaseContext();
            EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
            eventDispatcher.dispatchEvent(new SearchToolbarView.NavigationPressEvent(getId()));
        });
    }

    void setNavigationTestID(String navigationTestID) {
        this.navigationTestID = navigationTestID;
        setTestID();
    }

    void setOverflowTestID(String overflowTestID) {
        this.overflowTestID = overflowTestID;
        setTestID();
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
            children.get(i).setTintColor(tintColor);
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

    @Override
    public void initDrawerToggle(ActionBarDrawerToggle drawerToggle) {
        setTintColor(getNavigationIcon());
        setTestID();
        ViewGroup view = getParent() != null ? (ViewGroup) getParent().getParent() : null;
        if (view != null) {
            for(int i = 0; i < view.getChildCount(); i++) {
                if (view.getChildAt(i) instanceof SearchResultsView searchResultsView) {
                    DrawerArrowDrawable drawerArrowDrawable = new DrawerArrowDrawable(getContext());
                    drawerArrowDrawable.setColor(MaterialColors.getColor(this, R.attr.colorOnSurface));
                    searchResultsView.getToolbar().setNavigationIcon(drawerArrowDrawable);
                    searchResultsView.setAnimatedNavigationIcon(true);
                    searchResultsView.getToolbar().setNavigationOnClickListener(v -> searchResultsView.hide());
                }
            }
        }
    }

    static class NavigationPressEvent extends Event<SearchToolbarView.NavigationPressEvent> {
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
