package com.navigation.reactnative;

import android.content.Context;
import android.view.ViewGroup;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class TitleBarView extends ViewGroup {
    private boolean layoutRequested = false;
    private int resizeLoopCount = 0;

    public TitleBarView(Context context) {
        super(context);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    protected void onSizeChanged(final int w, final int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (Math.abs(w - oldw) > 5 || Math.abs(h - oldh) > 5)
            resizeLoopCount = 0;
        if (Math.abs(w - oldw) <= 5 && Math.abs(h - oldh) <= 5)
            resizeLoopCount++;
        if (resizeLoopCount <= 3) {
            ReactContext reactContext = (ReactContext) getContext();
            EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
            eventDispatcher.dispatchEvent(new TitleBarView.ChangeBoundsEvent(getId(), w, h));
        }
        requestLayout();
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

    static class ChangeBoundsEvent extends Event<TitleBarView.ChangeBoundsEvent> {
        private final int width;
        private final int height;

        public ChangeBoundsEvent(int viewId, int width, int height) {
            super(viewId);
            this.width = width;
            this.height = height;
        }

        @Override
        public String getEventName() {
            return "topOnChangeBounds";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putInt("width", (int) PixelUtil.toDIPFromPixel(this.width));
            event.putInt("height", (int) PixelUtil.toDIPFromPixel(this.height));
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }
}
