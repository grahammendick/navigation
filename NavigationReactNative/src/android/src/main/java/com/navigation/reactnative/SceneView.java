package com.navigation.reactnative;

import android.content.Context;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.HashSet;

public class SceneView extends ViewGroup {
    protected String sceneKey;
    protected String enterAnim;
    protected String exitAnim;
    public HashSet<SharedElementView> sharedElements = new HashSet<>();
    public SharedElementMotion transitioner;

    public SceneView(Context context) {
        super(context);
    }

    protected void popped() {
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onPopped", null);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
