package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.view.ViewOutlineProvider;

import androidx.core.util.Pools;
import androidx.core.view.ViewCompat;

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

    public NavigationBarView(Context context) {
        super(context);
        ViewCompat.setLayoutDirection(this, !I18nUtil.getInstance().isRTL(context) ? ViewCompat.LAYOUT_DIRECTION_LTR : ViewCompat.LAYOUT_DIRECTION_RTL);
        setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
        defaultOutlineProvider = getOutlineProvider();
        defaultBackground = getBackground();
        defaultShadowColor = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P ? getOutlineAmbientShadowColor() : -16777216;
        addOnOffsetChangedListener((appBarLayout, offset) -> {
            ReactContext reactContext = (ReactContext) getContext();
            EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
            eventDispatcher.dispatchEvent(OffsetChangedEvent.obtain(getId(), offset));
        });
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
