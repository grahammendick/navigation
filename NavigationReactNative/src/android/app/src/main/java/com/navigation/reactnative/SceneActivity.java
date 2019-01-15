package com.navigation.reactnative;

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.transition.Transition;
import android.transition.TransitionInflater;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;

import java.util.HashSet;

public class SceneActivity extends Activity implements DefaultHardwareBackBtnHandler {
    private ReactRootView mReactRootView;
    public static final String CRUMB = "Navigation.CRUMB";
    public static final String APP_KEY = "Navigation.APP_KEY";
    public static final String SHARED_ELEMENTS = "Navigation.SHARED_ELEMENTS";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mReactRootView = new ReactRootView(this);
        Bundle props = new Bundle();
        props.putInt("crumb", getIntent().getIntExtra(CRUMB, 0));
        String appKey = getIntent().getStringExtra(APP_KEY);
        HashSet<String> sharedElements = (HashSet<String>) getIntent().getSerializableExtra(SHARED_ELEMENTS);
        mReactRootView.startReactApplication(getReactNativeHost().getReactInstanceManager(), appKey, props);
        setContentView(mReactRootView);
        if (sharedElements != null ) {
            SharedElementTransitioner transitioner = new SharedElementTransitioner(this, sharedElements);
            mReactRootView.getRootView().setTag(R.id.sharedElementTransitioner, transitioner);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
            this.postponeEnterTransition();
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
    protected void onDestroy() {
        super.onDestroy();
        if (mReactRootView != null) {
            mReactRootView.unmountReactApplication();
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
}
