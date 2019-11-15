package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.view.ViewGroup;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.view.DraweeHolder;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class TabBarItemView extends ViewGroup implements NavigationBoundary {
    Fragment fragment;
    protected String title;
    private Drawable icon;
    private OnIconListener onIconListener;
    private IconResolver iconResolver;
    private final DraweeHolder tabIconHolder = DraweeHolder.create(createDraweeHierarchy(), getContext());
    private IconResolver.IconControllerListener tabIconControllerListener;

    public TabBarItemView(Context context) {
        super(context);
        iconResolver = new IconResolver(context);
        tabIconControllerListener = new IconResolver.IconControllerListener(tabIconHolder) {
            @Override
            protected void setDrawable(Drawable d) {
                icon = d;
                if (onIconListener != null)
                    onIconListener.onIconResolve(icon);
            }
        };
    }
    @Override
    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        tabIconHolder.onDetach();
    }

    @Override
    public void onStartTemporaryDetach() {
        super.onStartTemporaryDetach();
        tabIconHolder.onDetach();
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        tabIconHolder.onAttach();
    }

    @Override
    public void onFinishTemporaryDetach() {
        super.onFinishTemporaryDetach();
        tabIconHolder.onAttach();
    }

    void setIconSource(@Nullable ReadableMap source) {
        iconResolver.setIconSource(source, tabIconControllerListener, tabIconHolder);
    }

    void setOnIconListener(OnIconListener onIconListener) {
        this.onIconListener = onIconListener;
        if (icon!= null)
            this.onIconListener.onIconResolve(icon);

    }

    private GenericDraweeHierarchy createDraweeHierarchy() {
        return new GenericDraweeHierarchyBuilder(getContext().getResources())
            .setActualImageScaleType(ScalingUtils.ScaleType.FIT_CENTER)
            .setFadeDuration(0)
            .build();
    }

    protected void pressed() {
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onPress", null);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    public Fragment getFragment() {
        return fragment;
    }

    interface OnIconListener {
        void onIconResolve(Drawable icon);
    }
}
