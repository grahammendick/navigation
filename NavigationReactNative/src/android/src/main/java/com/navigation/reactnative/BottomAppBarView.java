package com.navigation.reactnative;

import android.content.Context;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.view.menu.ActionMenuItemView;
import androidx.appcompat.view.menu.MenuView;
import androidx.appcompat.widget.ActionMenuView;
import androidx.appcompat.widget.AppCompatImageButton;
import androidx.appcompat.widget.AppCompatImageView;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.bottomappbar.BottomAppBar;

import java.util.ArrayList;
import java.util.HashMap;

public class BottomAppBarView extends BottomAppBar {
    private Integer tintColor;
    final int defaultBackgroundColor;
    final Drawable defaultOverflowIcon;
    private Integer defaultMenuTintColor;
    private String navigationTestID;
    private String overflowTestID;
    private final IconResolver.IconResolverListener navIconResolverListener;
    private final IconResolver.IconResolverListener overflowIconResolverListener;
    private boolean layoutRequested = false;
    final ArrayList<View> children = new ArrayList<>();

    public BottomAppBarView(@NonNull Context context) {
        super(context, null);
        defaultBackgroundColor = getBackgroundTintList() != null ? getBackgroundTintList().getDefaultColor() : Color.BLACK;
        defaultOverflowIcon = getOverflowIcon();
        CoordinatorLayout.LayoutParams params = new CoordinatorLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.gravity = Gravity.BOTTOM;
        setLayoutParams(params);
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
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onNavigationPress", null);
            }
        });
        setOnMenuItemClickListener(new OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                for (int i = 0; i < children.size(); i++) {
                    if (children.get(i) instanceof BarButtonView) {
                        BarButtonView barButtonView = (BarButtonView) children.get(i);
                        if (barButtonView.getMenuItem() == item)
                            barButtonView.press();
                    }
                }
                return true;
            }
        });
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
}
