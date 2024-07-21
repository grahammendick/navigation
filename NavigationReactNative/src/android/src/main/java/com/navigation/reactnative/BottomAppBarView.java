package com.navigation.reactnative;

import android.content.Context;
import android.content.ContextWrapper;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
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
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.bottomappbar.BottomAppBar;

import java.util.ArrayList;
import java.util.HashMap;

public class BottomAppBarView extends BottomAppBar implements ActionView, DrawerToggleHandler {
    private MenuItem searchMenuItem;
    int crumb;
    boolean autoNavigation;
    private Integer tintColor;
    final int defaultBackgroundColor;
    final Drawable defaultOverflowIcon;
    private Drawable navigationIcon;
    int fabAlignmentMode;
    int defaultFabAlignmentMode;
    int defaultFabAnimationMode;
    float defaultFabCradleMargin;
    float defaultFabCradleRoundedCornerRadius;
    float defaultFabCradleVerticalOffset;
    private Integer defaultMenuTintColor;
    private ImageButton collapseButton;
    private OnSearchListener onSearchAddedListener;
    private String navigationTestID;
    private String overflowTestID;
    private final IconResolver.IconResolverListener navIconResolverListener;
    private final IconResolver.IconResolverListener overflowIconResolverListener;
    private boolean layoutRequested = false;
    final ArrayList<View> children = new ArrayList<>();

    public BottomAppBarView(@NonNull Context context) {
        super(context, null);
        setLayoutDirection(!I18nUtil.getInstance().isRTL(context) ? LAYOUT_DIRECTION_LTR : LAYOUT_DIRECTION_RTL);
        defaultBackgroundColor = getBackgroundTint() != null ? getBackgroundTint().getDefaultColor() : Color.WHITE;
        defaultOverflowIcon = getOverflowIcon();
        fabAlignmentMode = defaultFabAlignmentMode = getFabAlignmentMode();
        defaultFabAnimationMode = getFabAnimationMode();
        defaultFabCradleMargin = getFabCradleMargin();
        defaultFabCradleRoundedCornerRadius = getFabCradleRoundedCornerRadius();
        defaultFabCradleVerticalOffset = getCradleVerticalOffset();
        CoordinatorLayout.LayoutParams params = new CoordinatorLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.gravity = Gravity.BOTTOM;
        setLayoutParams(params);
        navIconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                navigationIcon = d;
                if (!autoNavigation) {
                    setNavigationIcon(d);
                    setTintColor(getNavigationIcon());
                    setTestID();
                }
            }
        };
        overflowIconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                setOverflowIcon(d);
                setTintColor(getOverflowIcon());
            }
        };
        setNavigationOnClickListener(this::onNavigationClick);
        setOnMenuItemClickListener(new OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                for (int i = 0; i < children.size(); i++) {
                    if (children.get(i) instanceof BarButtonView barButtonView) {
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

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (autoNavigation) registerDrawerToggleHandler();
        requestLayout();
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
                            BottomAppBarView.this.performShow();
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
                setNavigationIcon(null);
                activity.setSupportActionBar(this);
                assert activity.getSupportActionBar() != null;
                activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
                activity.setSupportActionBar(null);
            }
            registerDrawerToggleHandler();
        } else {
            setNavigationIcon(navigationIcon);
        }
        setNavigationOnClickListener(this::onNavigationClick);
        setTintColor(getNavigationIcon());
        setTestID();
        setFabAlignmentMode(fabAlignmentMode);
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
        ReactContext reactContext = (ReactContext) (getContext() instanceof ReactContext ? getContext() : ((ContextWrapper) getContext()).getBaseContext());
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
        eventDispatcher.dispatchEvent(new BottomAppBarView.NavigationPressEvent(getId()));
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

    @Override
    public void initDrawerToggle(ActionBarDrawerToggle drawerToggle) {
        setTintColor(getNavigationIcon());
        setTestID();
    }

    static class NavigationPressEvent extends Event<BottomAppBarView.NavigationPressEvent> {
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
