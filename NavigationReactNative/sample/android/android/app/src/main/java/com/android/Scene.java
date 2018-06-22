package com.android;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;

public class Scene extends Activity implements DefaultHardwareBackBtnHandler {
    private ReactRootView mReactRootView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mReactRootView = new ReactRootView(this);
        Bundle props = new Bundle();
        props.putInt("crumb", getIntent().getIntExtra("crumb", 0));
        mReactRootView.startReactApplication(getReactInstanceManager(), "android", props);
        setContentView(mReactRootView);
    }
    private ReactInstanceManager getReactInstanceManager() {
        return ((ReactApplication) getApplication()).getReactNativeHost().getReactInstanceManager();
    }
    @Override
    protected void onPause() {
        super.onPause();
        if (getReactInstanceManager() != null) {
            getReactInstanceManager().onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (getReactInstanceManager() != null) {
            getReactInstanceManager().onHostResume(this, this);
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
        if (keyCode == KeyEvent.KEYCODE_MENU && getReactInstanceManager() != null) {
            getReactInstanceManager().showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        if (getReactInstanceManager() != null) {
            getReactInstanceManager().onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }
}
