package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.transition.Transition;
import android.transition.TransitionInflater;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.uimanager.JSTouchDispatcher;
import com.facebook.react.uimanager.RootView;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.ArrayList;
import java.util.HashSet;

public class SceneActivity extends Activity implements DefaultHardwareBackBtnHandler {
    public static final String CRUMB = "Navigation.CRUMB";
    public static final String SHARED_ELEMENTS = "Navigation.SHARED_ELEMENTS";
    private SceneRootViewGroup rootView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        int crumb = getIntent().getIntExtra(CRUMB, 0);
        rootView = new SceneRootViewGroup(getReactNativeHost().getReactInstanceManager().getCurrentReactContext());
        crumb = Math.min(crumb, NavigationStackView.scenes.size() - 1);
        rootView.addView(NavigationStackView.scenes.get(crumb).view);
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
    protected void onNewIntent(Intent intent) {
        int crumb = intent.getIntExtra(CRUMB, 0);
        if (rootView.getChildCount() > 0)
            rootView.removeViewAt(0);
        View view = NavigationStackView.scenes.get(crumb).view;
        if (view.getParent() != null)
            ((ViewGroup) view.getParent()).removeView(view);
        rootView.addView(view);
    }

    private ReactNativeHost getReactNativeHost() {
        return ((ReactApplication) getApplication()).getReactNativeHost();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (getReactNativeHost().hasInstance()) {
            getReactNativeHost().getReactInstanceManager().onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (getReactNativeHost().hasInstance()) {
            getReactNativeHost().getReactInstanceManager().onHostResume(this, this);
        }
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && getReactNativeHost().hasInstance()) {
            getReactNativeHost().getReactInstanceManager().showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        if (getReactNativeHost().hasInstance()) {
            getReactNativeHost().getReactInstanceManager().onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    static class SceneRootViewGroup extends ReactViewGroup implements RootView {
        private final JSTouchDispatcher mJSTouchDispatcher = new JSTouchDispatcher(this);

        public SceneRootViewGroup(Context context) {
            super(context);
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
