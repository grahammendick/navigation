package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.view.ViewOutlineProvider;
import android.view.ViewParent;
import android.view.ViewTreeObserver;

import androidx.core.util.Pools;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.UIManagerModule;
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
    private final SceneView.WindowInsetsListener windowInsetsListener;

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
        windowInsetsListener = insets -> {
            int newTopInset = insets.getSystemWindowInsetTop();
            if (topInset != newTopInset) {
                topInset = newTopInset;
                final int viewTag = getId();
                final int newHeight = getLayoutParams().height + topInset;
                final ReactContext reactContext = (ReactContext) getContext();
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
        };
        getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
                getViewTreeObserver().removeOnPreDrawListener(this);
                if (getParent() instanceof CoordinatorLayoutView coordinatorLayoutView)
                    coordinatorLayoutView.measureAndLayout.run();
                else
                    measureAndLayout.run();
                return true;
            }
        });
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
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
        if (getChildAt(0) instanceof ToolbarView)
            heightMeasureSpec = MeasureSpec.makeMeasureSpec(MeasureSpec.getSize(heightMeasureSpec), MeasureSpec.UNSPECIFIED);
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

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
