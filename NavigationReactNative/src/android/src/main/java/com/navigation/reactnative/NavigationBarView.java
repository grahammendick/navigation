package com.navigation.reactnative;

import android.content.Context;
import android.graphics.Insets;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.view.ViewOutlineProvider;
import android.view.WindowInsets;

import androidx.core.util.Pools;
import androidx.core.view.WindowInsetsCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.appbar.AppBarLayout;

public class NavigationBarView extends AppBarLayout {
    final ViewOutlineProvider defaultOutlineProvider;
    final Drawable defaultBackground;
    final int defaultShadowColor;
    private boolean layoutRequested = false;
    private int topInset = 0;

    public NavigationBarView(Context context) {
        super(context);
        setLayoutDirection(!I18nUtil.getInstance().isRTL(context) ? LAYOUT_DIRECTION_LTR : LAYOUT_DIRECTION_RTL);
        setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
        defaultOutlineProvider = getOutlineProvider();
        defaultBackground = getBackground();
        defaultShadowColor = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P ? getOutlineAmbientShadowColor() : -16777216;
        setLiftOnScroll(false);
        setFitsSystemWindows(true);
        addOnOffsetChangedListener((appBarLayout, offset) -> {
            ReactContext reactContext = (ReactContext) getContext();
            EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
            eventDispatcher.dispatchEvent(OffsetChangedEvent.obtain(getId(), offset));
        });
    }

    protected void applyWindowInsets(WindowInsets insets) {
        int newTopInset = insets.getSystemWindowInsetTop();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            Insets barInsets = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            newTopInset = barInsets.top;
        }
        if (topInset != newTopInset) {
            topInset = newTopInset;
            // update native size
            if (measureAndLayout != null)
                measureAndLayout.run();
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

    private final Runnable measureAndLayout = () -> {
        layoutRequested = false;
        measure(
            MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
    };

    static class OffsetChangedEvent extends Event<OffsetChangedEvent> {
        private int offset;
        private static final Pools.SynchronizedPool<OffsetChangedEvent> pool = new Pools.SynchronizedPool<>(3);

        private OffsetChangedEvent() {
        }

        private static OffsetChangedEvent obtain(int viewTag, int offset) {
            OffsetChangedEvent event = pool.acquire();
            if (event == null)
                event = new OffsetChangedEvent();
            event.init(viewTag);
            event.offset = offset;
            return event;
        }

        @Override
        public void onDispose() {
            pool.release(this);
        }

        @Override
        public short getCoalescingKey() {
            return 0;
        }

        @Override
        public boolean canCoalesce() {
            return true;
        }

        @Override
        public String getEventName() {
            return "topOffsetChanged";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putDouble("offset", PixelUtil.toDIPFromPixel(offset));
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }
}
