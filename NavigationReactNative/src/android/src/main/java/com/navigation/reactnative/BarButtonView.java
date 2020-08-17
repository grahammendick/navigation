package com.navigation.reactnative;

import android.content.Context;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.view.MenuItem;
import android.view.ViewGroup;
import android.widget.ImageButton;

import androidx.annotation.Nullable;
import androidx.appcompat.view.CollapsibleActionView;

import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class BarButtonView extends ViewGroup implements CollapsibleActionView {
    private String title;
    private int showAsAction;
    private boolean search;
    private boolean showActionView;
    private MenuItem menuItem;
    private Integer tintColor;
    private Drawable icon;
    private IconResolver.IconResolverListener iconResolverListener;

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
        if (menuItem != null)
            menuItem.setTitle(title);
    }

    void setIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, iconResolverListener, getContext());
    }

    void setShowAsAction(int showAsAction) {
        this.showAsAction = showAsAction;
        if (menuItem != null)
            menuItem.setShowAsAction((!search && !showActionView) ? showAsAction : MenuItem.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW | showAsAction);
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
        setTitle(title);
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

    protected void press() {
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onPress", null);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    protected void onSizeChanged(final int w, final int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (getChildCount() == 0)
            return;
        final int viewTag = getChildAt(0).getId();
        final ReactContext reactContext = (ReactContext) getContext();
        reactContext.runOnNativeModulesQueueThread(
            new GuardedRunnable(reactContext) {
                @Override
                public void runGuarded() {
                    UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);
                    if (uiManager != null)
                        uiManager.updateNodeSize(viewTag, w, h);
                }
            });
    }

    @Override
    public void onActionViewExpanded() {
        if (getChildAt(0) instanceof ActionBarView)
            ((ActionBarView) getChildAt(0)).expanded();
        ToolbarView toolbarView = (ToolbarView) getParent();
        if (toolbarView.getChildAt(1) instanceof ImageButton)
            toolbarView.setCollapseButton((ImageButton) toolbarView.getChildAt(1));
    }

    @Override
    public void onActionViewCollapsed() {
        if (getChildAt(0) instanceof ActionBarView)
            ((ActionBarView) getChildAt(0)).collapsed();

    }
}
