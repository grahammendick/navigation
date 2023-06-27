package com.navigation.reactnative;

import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.ColorStateList;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.RippleDrawable;
import android.os.Build;
import android.text.SpannableString;
import android.text.style.AbsoluteSizeSpan;
import android.text.style.StyleSpan;
import android.text.style.TypefaceSpan;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.appcompat.view.menu.ActionMenuItemView;
import androidx.appcompat.view.menu.MenuView;
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
import com.google.android.material.search.SearchBar;
import com.google.android.material.shape.MaterialShapeDrawable;

import java.util.ArrayList;
import java.util.HashMap;

public class SearchToolbarView extends SearchBar {
    final Drawable defaultBackground;
    private Integer tintColor;
    private Integer defaultMenuTintColor;
    final Drawable defaultOverflowIcon;
    private String navigationTestID;
    private String overflowTestID;
    private String placeholder;
    private String fontFamily;
    private String fontWeight;
    private String fontStyle;
    private Integer fontSize;
    private boolean placeholderChanged = false;
    private final IconResolver.IconResolverListener navIconResolverListener;
    private final IconResolver.IconResolverListener overflowIconResolverListener;
    final ArrayList<BarButtonView> children = new ArrayList<>();

    public SearchToolbarView(Context context) {
        super(context);
        AppBarLayout.LayoutParams params = new AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT);
        params.setScrollFlags(AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL | AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS);
        setLayoutParams(params);
        defaultBackground = getBackground();
        defaultOverflowIcon = getOverflowIcon();
        navIconResolverListener = d -> {
            setNavigationIcon(d);
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

    void setPlaceholder(String placeholder) {
        this.placeholder = placeholder;
        placeholderChanged = true;
    }

    void setFontFamily(String fontFamily) {
        this.fontFamily = fontFamily;
        placeholderChanged = true;
    }

    void setFontWeight(String fontWeight) {
        this.fontWeight = fontWeight;
        placeholderChanged = true;
    }

    void setFontStyle(String fontStyle) {
        this.fontStyle = fontStyle;
        placeholderChanged = true;
    }

    void setFontSize(Integer fontSize) {
        this.fontSize = fontSize;
        placeholderChanged = true;
    }

    void stylePlaceholder() {
        if (placeholderChanged) {
            SpannableString placeholderSpannable = null;
            if (placeholder != null) {
                placeholderSpannable = new SpannableString(placeholder);
                if (fontFamily != null){
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
                        placeholderSpannable.setSpan(new TypefaceSpan(ReactFontManager.getInstance().getTypeface(fontFamily, 0, getContext().getAssets())), 0, placeholder.length(), 0);
                    else
                        placeholderSpannable.setSpan(new TypefaceSpan(fontFamily), 0, placeholder.length(), 0);
                }
                if (fontWeight != null)
                    placeholderSpannable.setSpan(new StyleSpan(ReactTypefaceUtils.parseFontWeight(fontWeight)), 0, placeholder.length(), 0);
                if (fontStyle != null)
                    placeholderSpannable.setSpan(new StyleSpan(ReactTypefaceUtils.parseFontStyle(fontStyle)), 0, placeholder.length(), 0);
                if (fontSize != null)
                    placeholderSpannable.setSpan(new AbsoluteSizeSpan(fontSize, true), 0, placeholder.length(), 0);
            }
            setHint(placeholderSpannable);
            placeholderChanged = false;
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
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
                icon.setColorFilter(tintColor, PorterDuff.Mode.SRC_IN);
            else
                icon.clearColorFilter();
        }
    }

    void setBarTintColor(int barTintColor) {
        Drawable drawable = defaultBackground;
        if (defaultBackground instanceof RippleDrawable)
            drawable = ((RippleDrawable) defaultBackground).getDrawable(0);
        if (drawable instanceof MaterialShapeDrawable) {
            drawable = drawable.getConstantState().newDrawable();
            ((MaterialShapeDrawable) drawable).setFillColor(ColorStateList.valueOf(barTintColor));
            setBackground(drawable);
        }
    }

    void setMenuItems() {
        getMenu().clear();
        HashMap<MenuItem, String> testIDs = new HashMap<>();
        for (int i = 0; i < children.size(); i++) {
            BarButtonView barButton = children.get(i);
            MenuItem menuItem = getMenu().add(Menu.NONE, Menu.NONE, i, "");
            barButton.setMenuItem(menuItem);
            testIDs.put(menuItem, barButton.testID);
        }
        setMenuTintColor(testIDs);
        setTestID();
        requestLayout();
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
            children.get(i).setTintColor(tintColor);
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

    static class NavigationPressEvent extends Event<SearchToolbarView.NavigationPressEvent> {
        public NavigationPressEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topOnNavigationPress";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), Arguments.createMap());
        }
    }
}
