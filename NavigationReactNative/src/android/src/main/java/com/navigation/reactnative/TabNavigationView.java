package com.navigation.reactnative;

import android.content.Context;
import android.content.ContextWrapper;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.annotation.UiThread;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.StateWrapper;
import com.facebook.react.uimanager.UIManagerModule;
import com.google.android.material.badge.BadgeDrawable;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class TabNavigationView extends BottomNavigationView implements TabView {
    final int defaultTextColor;
    int selectedTintColor;
    int unselectedTintColor;
    int defaultActiveIndicatorColor;
    int defaultRippleColor;
    final int defaultShadowColor;
    private boolean layoutRequested = false;
    private boolean autoSelected = false;
    private int bottomInset = 0;
    private final SceneView.WindowInsetsListener windowInsetsListener;
    private StateWrapper stateWrapper = null;

    public TabNavigationView(Context context) {
        super(context);
        setLayoutDirection(!I18nUtil.getInstance().isRTL(context) ? LAYOUT_DIRECTION_LTR : LAYOUT_DIRECTION_RTL);
        setBackground(null);
        TabLayoutView tabLayout = new TabLayoutView(context);
        selectedTintColor = unselectedTintColor = defaultTextColor = tabLayout.defaultTextColor;
        defaultActiveIndicatorColor = getItemActiveIndicatorColor() != null ? getItemActiveIndicatorColor().getDefaultColor() : Color.WHITE;
        defaultRippleColor = getItemRippleColor() != null ? getItemRippleColor().getColorForState(new int[]{ android.R.attr.state_pressed }, Color.WHITE) : Color.WHITE;
        defaultShadowColor = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P ? getOutlineAmbientShadowColor() : Color.WHITE;
        CoordinatorLayout.LayoutParams params = new CoordinatorLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.gravity = Gravity.BOTTOM;
        setLayoutParams(params);
        setOnItemSelectedListener(menuItem -> {
            TabBarView tabBar = getTabBar();
            if (!autoSelected && tabBar != null && tabBar.selectedTab == menuItem.getOrder())
                tabBar.scrollToTop();
            if (tabBar != null && tabBar.selectedTab != menuItem.getOrder()) {
                if (tabBar.foucCounter == getTabBar().tabFragments.get(menuItem.getOrder()).tabBarItem.foucCounter) {
                    tabBar.setCurrentTab(menuItem.getOrder());
                } else {
                    tabBar.selectTab(menuItem.getOrder());
                    return false;
                }
            }
            return true;
        });
        windowInsetsListener = insets -> {
            int newBottomInset = insets.getSystemWindowInsetBottom();
            if (bottomInset != newBottomInset) {
                bottomInset = newBottomInset;
                final int newHeight = getMinimumHeight() + bottomInset;
                if (stateWrapper != null) {
                    updateState(-1, newHeight);
                } else {
                    final int viewTag = getId();
                    final ReactContext reactContext = (ReactContext) (getContext() instanceof ReactContext ? getContext() : ((ContextWrapper) getContext()).getBaseContext());
                    reactContext.runOnNativeModulesQueueThread(
                        new GuardedRunnable(reactContext) {
                            @Override
                            public void runGuarded() {
                                UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);
                                if (uiManager != null)
                                    uiManager.updateNodeSize(viewTag, -1, newHeight);
                            }
                        });
                }
            }
        };
    }

    public void setStateWrapper(StateWrapper stateWrapper) {
        this.stateWrapper = stateWrapper;
    }

    @UiThread
    public void updateState(final int width, final int height) {
        final float realWidth = PixelUtil.toDIPFromPixel(width);
        final float realHeight = PixelUtil.toDIPFromPixel(height);
        ReadableMap currentState = stateWrapper.getStateData();
        if (currentState != null) {
            float delta = (float) 0.9;
            float stateScreenHeight =
                    currentState.hasKey("frameHeight")
                            ? (float) currentState.getDouble("frameHeight")
                            : 0;
            float stateScreenWidth =
                    currentState.hasKey("frameWidth") ? (float) currentState.getDouble("frameWidth") : 0;

            if (Math.abs(stateScreenWidth - realWidth) < delta
                    && Math.abs(stateScreenHeight - realHeight) < delta) {
                return;
            }
        }
        if (stateWrapper != null) {
            WritableMap map = new WritableNativeMap();
            map.putDouble("frameWidth", realWidth);
            map.putDouble("frameHeight", realHeight);
            stateWrapper.updateState(map);
        }
    }

    void setTitles() {
        TabBarView tabBar = getTabBar();
        for (int i = 0; tabBar != null && i < tabBar.tabFragments.size(); i++) {
            CharSequence title = getTabBar().tabFragments.get(i).tabBarItem.styledTitle;
            MenuItem item = getMenu().findItem(i);
            if (item != null && item.getTitle() != title)
                item.setTitle(title);
            if (item == null)
                getMenu().add(Menu.NONE, i, i, title);
        }
        assert tabBar != null;
        for(int i = getMenu().size() - 1; i >= tabBar.tabFragments.size(); i--) {
            getMenu().removeItem(i);
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        TabBarView tabBar = getTabBar();
        if (tabBar != null) {
            autoSelected = true;
            setSelectedItemId(tabBar.selectedTab);
            autoSelected = false;
            tabBar.populateTabs();
        }
        SceneView scene = getScene();
        if (scene != null)
            scene.addWindowInsetsListener(windowInsetsListener);
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        SceneView scene = getScene();
        if (scene != null)
            scene.removeWindowInsetsListener(windowInsetsListener);
    }

    private SceneView getScene() {
        ViewParent parent = getParent();
        while (parent != null) {
            if (parent instanceof SceneView sceneView)
                return sceneView;
            parent = parent.getParent();
        }
        return null;
    }

    private TabBarView getTabBar() {
        for(int i = 0; getParent() != null && i < ((ViewGroup) getParent()).getChildCount(); i++) {
            View child = ((ViewGroup) getParent()).getChildAt(i);
            if (child instanceof TabBarView)
                return (TabBarView) child;
        }
        return null;
    }

    void tabSelected(int index) {
        autoSelected = true;
        setSelectedItemId(index);
        autoSelected = false;
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
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        heightMeasureSpec = MeasureSpec.makeMeasureSpec(MeasureSpec.getSize(heightMeasureSpec), MeasureSpec.UNSPECIFIED);
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    @Override
    public void setPaddingRelative(int start, int top, int end, int bottom) {
        super.setPaddingRelative(start, top, end, bottom);
        if (getParent() instanceof CoordinatorLayoutView coordinatorLayoutView)
            coordinatorLayoutView.measureAndLayout.run();
    }

    @Override
    public void setTitle(int index, CharSequence title) {
        getMenu().getItem(index).setTitle(title);
    }

    public void setIcon(int index, Drawable icon) {
        getMenu().getItem(index).setIcon(icon);
    }

    @Override
    public void setTestID(int index, String testID) {
        if (getTouchables().size() > index) {
            View itemView = getTouchables().get(index);
            itemView.setTag(testID);
        }
    }

    @Override
    public BadgeDrawable getBadgeIcon(int index) {
        return getOrCreateBadge(index);
    }

    @Override
    public void removeBadgeIcon(int index) {
        removeBadge(index);
        if (getTouchables().size() > index) {
            ViewGroup itemView = (ViewGroup) getTouchables().get(index);
            itemView.getChildAt(0).getOverlay().clear();
        }
    }
}
