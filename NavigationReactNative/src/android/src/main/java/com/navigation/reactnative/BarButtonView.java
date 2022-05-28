package com.navigation.reactnative;

import android.content.Context;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.text.SpannableString;
import android.text.style.AbsoluteSizeSpan;
import android.text.style.StyleSpan;
import android.text.style.TypefaceSpan;
import android.view.MenuItem;
import android.view.ViewGroup;
import android.widget.ImageButton;

import androidx.annotation.Nullable;
import androidx.appcompat.view.CollapsibleActionView;

import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.text.ReactTypefaceUtils;

public class BarButtonView extends ViewGroup implements CollapsibleActionView {
    String testID;
    private String title;
    private String fontFamily;
    private String fontWeight;
    private String fontStyle;
    private Integer fontSize;
    private boolean titleChanged = false;
    private int showAsAction;
    private boolean actionBar;
    private boolean search;
    private boolean showActionView;
    private MenuItem menuItem;
    private Integer tintColor;
    private Drawable icon;
    private final IconResolver.IconResolverListener iconResolverListener;

    public BarButtonView(Context context) {
        super(context);
        iconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                icon = d;
                setTintColor(tintColor);
                if (menuItem != null)
                    menuItem.setIcon(d);
            }
        };
    }

    boolean getSearch() {
        return search;
    }

    MenuItem getMenuItem() {
        return menuItem;
    }

    void setTitle(String title) {
        this.title = title;
        titleChanged = true;
    }

    void setFontFamily(String fontFamily) {
        this.fontFamily = fontFamily;
        titleChanged = true;
    }

    void setFontWeight(String fontWeight) {
        this.fontWeight = fontWeight;
        titleChanged = true;
    }

    void setFontStyle(String fontStyle) {
        this.fontStyle = fontStyle;
        titleChanged = true;
    }

    void setFontSize(Integer fontSize) {
        this.fontSize = fontSize;
        titleChanged = true;
    }

    void setIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, iconResolverListener, getContext());
    }

    void setShowAsAction(int showAsAction) {
        this.showAsAction = showAsAction;
        if (menuItem != null)
            menuItem.setShowAsAction((!search && (!showActionView || !actionBar)) ? showAsAction : MenuItem.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW | showAsAction);
    }

    void setActionBar(boolean actionBar) {
        this.actionBar = actionBar;
        setShowAsAction(showAsAction);
    }

    void setSearch(boolean search) {
        this.search = search;
        setShowAsAction(showAsAction);
    }

    void setShowActionView(boolean showActionView) {
        this.showActionView = showActionView;
        setShowAsAction(showAsAction);
        if (menuItem != null)
            menuItem.setActionView(showActionView ? this : null);
    }

    void setMenuItem(MenuItem menuItem) {
        this.menuItem = menuItem;
        titleChanged = true;
        styleTitle();
        menuItem.setIcon(icon);
        setShowAsAction(showAsAction);
        setShowActionView(showActionView);
    }

    void setTintColor(Integer tintColor) {
        this.tintColor = tintColor;
        if (icon != null) {
            if (tintColor != null)
                icon.setColorFilter(tintColor, PorterDuff.Mode.SRC_IN);
            else
                icon.clearColorFilter();
        }
    }

    void styleTitle() {
        if (menuItem != null && titleChanged) {
            SpannableString titleSpannable = null;
            if (title != null) {
                titleSpannable = new SpannableString(title);
                if (fontFamily != null)
                    titleSpannable.setSpan(new TypefaceSpan(fontFamily), 0, title.length(), 0);
                if (fontWeight != null)
                    titleSpannable.setSpan(new StyleSpan(ReactTypefaceUtils.parseFontWeight(fontWeight)), 0, title.length(), 0);
                if (fontStyle != null)
                    titleSpannable.setSpan(new StyleSpan(ReactTypefaceUtils.parseFontStyle(fontStyle)), 0, title.length(), 0);
                if (fontSize != null)
                    titleSpannable.setSpan(new AbsoluteSizeSpan(fontSize, true), 0, title.length(), 0);
            }
            menuItem.setTitle(titleSpannable);
            titleChanged = false;
        }
    }

    protected void press() {
        ReactContext reactContext = (ReactContext) getContext();
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
        eventDispatcher.dispatchEvent(new BarButtonView.PressEvent(getId()));
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    protected void onSizeChanged(final int w, final int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (getChildCount() == 0 || !actionBar)
            return;
        ((ActionBarView) getChildAt(0)).changeBounds(w, h, oldw, oldh);
    }

    @Override
    public void onActionViewExpanded() {
        if (getChildAt(0) instanceof ActionBarView)
            ((ActionBarView) getChildAt(0)).expanded();
        ActionView actionView = (ActionView) getParent();
        if (actionView.getChildAt(1) instanceof ImageButton) {
            ImageButton imageButton = (ImageButton) actionView.getChildAt(1);
            actionView.setCollapseButton(imageButton);
        }
    }

    @Override
    public void onActionViewCollapsed() {
        if (getChildAt(0) instanceof ActionBarView)
            ((ActionBarView) getChildAt(0)).collapsed();

    }

    static class PressEvent extends Event<BarButtonView.PressEvent> {
        public PressEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topOnPress";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
        }
    }
}
