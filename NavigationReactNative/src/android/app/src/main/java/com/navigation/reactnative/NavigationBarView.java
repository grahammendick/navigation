package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.view.DraweeHolder;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.appbar.AppBarLayout;

import java.util.ArrayList;
import java.util.List;

import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;

public class NavigationBarView extends AppBarLayout {
    List<View> barViews = new ArrayList<>();
    private IconResolver iconResolver;

    private Toolbar toolbar;

    private final DraweeHolder mLogoHolder = DraweeHolder.create(createDraweeHierarchy(), getContext());
    private final DraweeHolder mNavIconHolder = DraweeHolder.create(createDraweeHierarchy(), getContext());
    private final DraweeHolder mOverflowIconHolder = DraweeHolder.create(createDraweeHierarchy(), getContext());

    private IconResolver.IconControllerListener mLogoControllerListener;
    private IconResolver.IconControllerListener mNavIconControllerListener;
    private IconResolver.IconControllerListener mOverflowIconControllerListener;

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
        buildMenu();
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
    }

    private void attachDraweeHolders() {
        mLogoHolder.onAttach();
        mNavIconHolder.onAttach();
        mOverflowIconHolder.onAttach();
    }

    void addBar(int index, View barView) {
        barViews.add(index, barView);
        buildMenu();
    }

    void removeBar(int index) {
        barViews.remove(index);
        buildMenu();
    }

    void setTitle(String title) {
        toolbar.setTitle(title);
    }

    void buildMenu() {
        toolbar.getMenu().clear();
        LeftBarView leftBarView = null;
        RightBarView rightBarView = null;
        for (View barView: barViews) {
            if (barView instanceof LeftBarView) {
                leftBarView = (LeftBarView) barView;
            } else if (barView instanceof RightBarView) {
                rightBarView = (RightBarView) barView;
            }
        }
        if (leftBarView != null) {
            for (int i = 0; i < leftBarView.getChildCount(); i++) {
                BarButtonView barButtonView = (BarButtonView) leftBarView.getChildAt(i);
                MenuItem menuItem = toolbar.getMenu().add(barButtonView.title);
                barButtonView.menuItem = menuItem;
                barButtonView.update();
            }
        }
        if (rightBarView != null) {
            for (int i = 0; i < rightBarView.getChildCount(); i++) {
                BarButtonView barButtonView = (BarButtonView) rightBarView.getChildAt(i);
                MenuItem menuItem = toolbar.getMenu().add(barButtonView.title);
                barButtonView.menuItem = menuItem;
                barButtonView.update();
            }
        }
        requestLayout();
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
