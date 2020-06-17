package com.navigation.reactnative;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.transition.Transition;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;

import androidx.core.app.SharedElementCallback;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.uimanager.JSTouchDispatcher;
import com.facebook.react.uimanager.RootView;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.HashMap;
import java.util.HashSet;

public class SceneActivity extends ReactActivity implements DefaultHardwareBackBtnHandler, SharedElementContainer {
    public static final String KEY = "Navigation.KEY";
    public static final String SHARED_ELEMENTS = "Navigation.SHARED_ELEMENTS";
    protected static HashMap<String, SceneView> scenes;
    private SceneView scene;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        String key = getIntent().getStringExtra(KEY);
        SceneRootViewGroup rootView = new SceneRootViewGroup(getReactNativeHost().getReactInstanceManager().getCurrentReactContext());
        if (SceneActivity.scenes.containsKey(key)) {
            scene = SceneActivity.scenes.get(key);
            if (scene.getParent() != null)
                ((ViewGroup) scene.getParent()).removeView(scene);
            rootView.addView(scene);
        }
        setContentView(rootView);
        @SuppressWarnings("unchecked")
        HashSet<String> sharedElementNames = (HashSet<String>) getIntent().getSerializableExtra(SHARED_ELEMENTS);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && sharedElementNames != null ) {
            postponeEnterTransition();
            scene.transitioner = new SharedElementTransitioner(this, sharedElementNames);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (!getIntent().getStringExtra(KEY).equals(intent.getStringExtra(KEY)))
            navigateUpTo(intent);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (scene != null)
            scene.popped();
    }

    @Override
    public SceneView getScene() {
        return scene;
    }

    @Override
    public void setEnterTransition(Transition transition) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
            getWindow().setSharedElementEnterTransition(transition);
    }

    @Override
    public void setReturnTransition(Transition transition) {
    }

    @Override
    public void setExitCallback(SharedElementCallback sharedElementCallback) {
        setExitSharedElementCallback(sharedElementCallback);
    }

    @Override
    public void setEnterCallback(SharedElementCallback sharedElementCallback) {
        setEnterSharedElementCallback(sharedElementCallback);
    }

    static class SceneRootViewGroup extends ReactViewGroup implements RootView {
        private boolean hasAdjustedSize = false;
        private int viewWidth;
        private int viewHeight;

        private final JSTouchDispatcher mJSTouchDispatcher = new JSTouchDispatcher(this);

        public SceneRootViewGroup(Context context) {
            super(context);
        }

        @Override
        protected void onSizeChanged(final int w, final int h, int oldw, int oldh) {
            super.onSizeChanged(w, h, oldw, oldh);
            viewWidth = w;
            viewHeight = h;
            updateFirstChildView();
        }

        private void updateFirstChildView() {
            if (getChildCount() > 0) {
                hasAdjustedSize = false;
                final int viewTag = getChildAt(0).getId();
                ReactContext reactContext = getReactContext();
                reactContext.runOnNativeModulesQueueThread(
                    new GuardedRunnable(reactContext) {
                        @Override
                        public void runGuarded() {
                            (getReactContext()).getNativeModule(UIManagerModule.class)
                                .updateNodeSize(viewTag, viewWidth, viewHeight);
                        }
                    });
            } else {
                hasAdjustedSize = true;
            }
        }

        @Override
        public void addView(View child, int index, LayoutParams params) {
            super.addView(child, index, params);
            if (hasAdjustedSize) {
                updateFirstChildView();
            }
        }

        @Override
        public void handleException(Throwable t) {
            getReactContext().handleException(new RuntimeException(t));
        }

        private ReactContext getReactContext() {
            return (ReactContext) getContext();
        }

        @Override
        public boolean onInterceptTouchEvent(MotionEvent event) {
            mJSTouchDispatcher.handleTouchEvent(event, getEventDispatcher());
            return super.onInterceptTouchEvent(event);
        }

        @Override
        public boolean onTouchEvent(MotionEvent event) {
            mJSTouchDispatcher.handleTouchEvent(event, getEventDispatcher());
            super.onTouchEvent(event);
            return true;
        }

        @Override
        public void onChildStartedNativeGesture(MotionEvent androidEvent) {
            mJSTouchDispatcher.onChildStartedNativeGesture(androidEvent, getEventDispatcher());
        }

        @Override
        public void requestDisallowInterceptTouchEvent(boolean disallowIntercept) {
        }

        private EventDispatcher getEventDispatcher() {
            ReactContext reactContext = getReactContext();
            return reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        }
    }
}
