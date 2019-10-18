package com.navigation.reactnative;

import android.content.Context;
import android.view.MenuItem;
import android.view.ViewGroup;

import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.view.DraweeHolder;
import com.facebook.drawee.view.MultiDraweeHolder;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class BarButtonView extends ViewGroup {
    private final MultiDraweeHolder<GenericDraweeHierarchy> mActionsHolder =
            new MultiDraweeHolder<>();

    protected String title;

    protected ReadableMap iconSource;
    protected MenuItem menuItem;
    protected Integer showAsAction;

    private IconResolver iconResolver;

    public BarButtonView(Context context) {
        super(context);
        iconResolver = new IconResolver(context);
    }

    @Override
    protected void onLayout(boolean b, int i, int i1, int i2, int i3) {

    }

    protected void update() {
        if (menuItem == null) {
            return;
        }
        if (showAsAction != null) {
            menuItem.setShowAsAction(showAsAction);
        }
        if (iconSource != null) {
            setMenuItemIcon(menuItem, iconSource);
        }
        menuItem.setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem menuItem) {
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onPress", null);
                return true;
            }
        });
        menuItem.setTitle(title);
    }

    protected void setShow(String show) {
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
            default: break;
        }
        if (menuItem != null && showAsAction != null) {
            menuItem.setShowAsAction(showAsAction);
        }
    }

    protected void setTitle(String title) {
        if (menuItem != null) {
            menuItem.setTitle(title);
        }
        this.title = title;
    }

    void setIcon(ReadableMap source) {
        iconSource = source;
        if (menuItem != null && iconSource != null) {
            setMenuItemIcon(menuItem, iconSource);
        }
    }

    private GenericDraweeHierarchy createDraweeHierarchy() {
        return new GenericDraweeHierarchyBuilder(getContext().getResources())
                .setActualImageScaleType(ScalingUtils.ScaleType.FIT_CENTER)
                .setFadeDuration(0)
                .build();
    }

    void setMenuItemIcon(final MenuItem item, ReadableMap iconSource) {
        DraweeHolder<GenericDraweeHierarchy> holder =
                DraweeHolder.create(createDraweeHierarchy(), getContext());
        IconResolver.ActionIconControllerListener controllerListener = iconResolver.new ActionIconControllerListener(item, holder);
        controllerListener.setIconImageInfo(iconResolver.getIconImageInfo(iconSource));

        iconResolver.setIconSource(iconSource, controllerListener, holder);
        mActionsHolder.add(holder);
        mActionsHolder.onAttach();
    }

}
