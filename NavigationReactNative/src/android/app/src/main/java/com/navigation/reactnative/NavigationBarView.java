package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

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
import androidx.appcompat.widget.Toolbar;

public class NavigationBarView extends AppBarLayout {
    private IconResolver iconResolver;

    private Toolbar toolbar;

    private final DraweeHolder mLogoHolder = DraweeHolder.create(createDraweeHierarchy(), getContext());
    private final DraweeHolder mNavIconHolder = DraweeHolder.create(createDraweeHierarchy(), getContext());
    private final DraweeHolder mOverflowIconHolder = DraweeHolder.create(createDraweeHierarchy(), getContext());

    private IconResolver.IconControllerListener mLogoControllerListener;
    private IconResolver.IconControllerListener mNavIconControllerListener;
    private IconResolver.IconControllerListener mOverflowIconControllerListener;
    private final MultiDraweeHolder<GenericDraweeHierarchy> mActionsHolder =
            new MultiDraweeHolder<>();

    public NavigationBarView(Context context) {
        super(context);

        toolbar = new Toolbar(context);
        addView(toolbar, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

        iconResolver = new IconResolver(context);
        mLogoControllerListener = iconResolver.new IconControllerListener(mLogoHolder) {
            @Override
            protected void setDrawable(Drawable d) {
                toolbar.setLogo(d);
                requestLayout();
            }
        };
        mNavIconControllerListener = iconResolver.new IconControllerListener(mNavIconHolder) {
            @Override
            protected void setDrawable(Drawable d) {
                toolbar.setNavigationIcon(d);
                requestLayout();
            }
        };
        mOverflowIconControllerListener = iconResolver.new IconControllerListener(mNavIconHolder) {
            @Override
            protected void setDrawable(Drawable d) {
                toolbar.setOverflowIcon(d);
                requestLayout();
            }
        };
        toolbar.setNavigationOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onIconClicked", null);
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
        iconResolver.setIconSource(source, mLogoControllerListener, mLogoHolder);
    }

    void setNavIconSource(@Nullable ReadableMap source) {
        iconResolver.setIconSource(source, mNavIconControllerListener, mNavIconHolder);
    }

    void setOverflowIconSource(@Nullable ReadableMap source) {
        iconResolver.setIconSource(source, mOverflowIconControllerListener, mOverflowIconHolder);
    }

    private void detachDraweeHolders() {
        mLogoHolder.onDetach();
        mNavIconHolder.onDetach();
        mOverflowIconHolder.onDetach();
        mActionsHolder.onDetach();
    }

    private void attachDraweeHolders() {
        mLogoHolder.onAttach();
        mNavIconHolder.onAttach();
        mOverflowIconHolder.onAttach();
        mActionsHolder.onDetach();
    }

    void addTitleView(TitleBarView titleView) {
        Toolbar.LayoutParams layoutParams = new Toolbar.LayoutParams(
                Toolbar.LayoutParams.MATCH_PARENT,
                Toolbar.LayoutParams.MATCH_PARENT,
                Gravity.CENTER
        );
        toolbar.addView(titleView, layoutParams);
    }

    void setTitle(String title) {
        toolbar.setTitle(title);
    }

    void setMenuItems(@Nullable ReadableArray menuItems) {
        toolbar.getMenu().clear();
        if (menuItems != null) {
            for (int i = 0; i < menuItems.size(); i++) {
                ReadableMap menuItemProps = menuItems.getMap(i);
                if (menuItemProps == null) {
                    continue;
                }
                String title = menuItemProps.getString("title");
                ReadableMap iconSource = menuItemProps.getMap("image");
                String show = menuItemProps.getString("show");

                MenuItem menuItem = toolbar.getMenu().add(title);
                if (iconSource != null) {
                    setMenuItemIcon(menuItem, iconSource);
                }
                if (show != null) {
                    setMenuItemShow(menuItem, show);
                }
            }
        }

        requestLayout();
    }

    private void setMenuItemShow(MenuItem menuItem, String show) {
        int showAsAction;
        switch (show) {
            case "always": {
                showAsAction = MenuItem.SHOW_AS_ACTION_ALWAYS;
                break;
            }
            case "ifRoom": {
                showAsAction = MenuItem.SHOW_AS_ACTION_IF_ROOM;
                break;
            }
            case "never": {
                showAsAction = MenuItem.SHOW_AS_ACTION_NEVER;
                break;
            }
            default: {
                showAsAction = MenuItem.SHOW_AS_ACTION_IF_ROOM;
                break;
            }
        }
        menuItem.setShowAsAction(showAsAction);
    }

    private void setMenuItemIcon(final MenuItem item, ReadableMap iconSource) {
        DraweeHolder<GenericDraweeHierarchy> holder =
                DraweeHolder.create(createDraweeHierarchy(), getContext());
        IconResolver.ActionIconControllerListener controllerListener = iconResolver.new ActionIconControllerListener(item, holder);
        controllerListener.setIconImageInfo(iconResolver.getIconImageInfo(iconSource));

        iconResolver.setIconSource(iconSource, controllerListener, holder);
        mActionsHolder.add(holder);
        mActionsHolder.onAttach();
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

        // The toolbar relies on a measure + layout pass happening after it calls requestLayout().
        // Without this, certain calls (e.g. setLogo) only take effect after a second invalidation.
        post(mLayoutRunnable);
    }
}
