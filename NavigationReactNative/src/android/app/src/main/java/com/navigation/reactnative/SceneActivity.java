package com.navigation.reactnative;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.uimanager.JSTouchDispatcher;
import com.facebook.react.uimanager.RootView;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.HashSet;

public class SceneActivity extends ReactActivity implements DefaultHardwareBackBtnHandler {
    public static final String CRUMB = "Navigation.CRUMB";
    public static final String SHARED_ELEMENTS = "Navigation.SHARED_ELEMENTS";
    private SceneRootViewGroup rootView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        int crumb = getIntent().getIntExtra(CRUMB, 0);
        rootView = new SceneRootViewGroup(getReactNativeHost().getReactInstanceManager().getCurrentReactContext());
        if (crumb < NavigationStackView.sceneItems.size()) {
            View view = NavigationStackView.sceneItems.get(crumb).view;
            if (view.getParent() != null)
                ((ViewGroup) view.getParent()).removeView(view);
            rootView.addView(view);
        }
        setContentView(rootView);
        @SuppressWarnings("unchecked")
        HashSet<String> sharedElements = (HashSet<String>) getIntent().getSerializableExtra(SHARED_ELEMENTS);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && sharedElements != null ) {
            this.postponeEnterTransition();
            SharedElementTransitioner transitioner = new SharedElementTransitioner(this, sharedElements);
            findViewById(android.R.id.content).getRootView().setTag(R.id.sharedElementTransitioner, transitioner);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        int crumb = intent.getIntExtra(CRUMB, 0);
        if (rootView.getChildCount() > 0)
            rootView.removeViewAt(0);
        if (crumb < NavigationStackView.sceneItems.size()) {
            View view = NavigationStackView.sceneItems.get(crumb).view;
            if (view.getParent() != null)
                ((ViewGroup) view.getParent()).removeView(view);
            rootView.addView(view);
        }
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

    public static class Crumb1 extends SceneActivity {} public static class Crumb2 extends SceneActivity {}
    public static class Crumb3 extends SceneActivity {} public static class Crumb4 extends SceneActivity {}
    public static class Crumb5 extends SceneActivity {} public static class Crumb6 extends SceneActivity {}
    public static class Crumb7 extends SceneActivity {} public static class Crumb8 extends SceneActivity {}
    public static class Crumb9 extends SceneActivity {} public static class Crumb10 extends SceneActivity {}
    public static class Crumb11 extends SceneActivity {} public static class Crumb12 extends SceneActivity {}
    public static class Crumb13 extends SceneActivity {} public static class Crumb14 extends SceneActivity {}
    public static class Crumb15 extends SceneActivity {} public static class Crumb16 extends SceneActivity {}
    public static class Crumb17 extends SceneActivity {} public static class Crumb18 extends SceneActivity {}
    public static class Crumb19 extends SceneActivity {} public static class Crumb20 extends SceneActivity {}

    public static Class getActivity(int crumb) {
        try {
            return Class.forName("com.navigation.reactnative.SceneActivity$Crumb" + crumb);
        } catch (ClassNotFoundException e) {
            return SceneActivity.class;
        }
    }

}
