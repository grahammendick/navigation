package com.navigation.reactnative;

import android.content.Context;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.HashSet;

public class SceneView extends ReactViewGroup {
    protected int crumb;
    protected String sceneKey;
    protected String enterAnim;
    protected String exitAnim;
    public final HashSet<SharedElementView> sharedElements = new HashSet<>();
    public SharedElementMotion sharedElementMotion;

    public SceneView(Context context) {
        super(context);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        View child = getChildAt(0);
        if (child != null && child.getClass().getSimpleName().contains("DrawerLayout")) {
            child.requestLayout();
            post(measureAndLayoutDrawer);
        }
    }

    private final Runnable measureAndLayoutDrawer = new Runnable() {
        @Override
        public void run() {
            View drawer = getChildAt(0);
            if (drawer == null) return;
            drawer.measure(
                MeasureSpec.makeMeasureSpec(drawer.getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(drawer.getHeight(), MeasureSpec.EXACTLY));
            drawer.layout(drawer.getLeft(), drawer.getTop(), drawer.getRight(), drawer.getBottom());
        }
    };

    protected void popped() {
        ReactContext reactContext = (ReactContext) getContext();
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
        eventDispatcher.dispatchEvent(new PoppedEvent(getId()));
    }

    static class PoppedEvent extends Event<PoppedEvent> {
        public PoppedEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topOnPopped";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), Arguments.createMap());
        }
    }
}
