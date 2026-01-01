package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.view.WindowInsets;

import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.widget.Toolbar;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

import java.lang.ref.WeakReference;
import java.util.HashSet;

public class SceneView extends ReactViewGroup {
    protected int crumb;
    protected boolean stacked;
    protected String sceneKey;
    protected String enterAnim;
    protected String exitAnim;
    protected AnimationPropParser.Animator enterAnimator;
    protected AnimationPropParser.Animator exitAnimator;
    protected ReadableMap enterTrans;
    protected ReadableMap exitTrans;
    private boolean landscape;
    public final HashSet<SharedElementView> sharedElements = new HashSet<>();
    SharedElementMotion sharedElementMotion;
    private WeakReference<Toolbar> toolbar;
    private WeakReference<DrawerLayoutView> drawer;
    private final HashSet<WindowInsetsListener> windowInsetsListeners = new HashSet<>();

    public SceneView(Context context) {
        super(context);
        setTransitionGroup(true);
    }

    protected void setLandscape(boolean landscape) {
        if (landscape != this.landscape) {
            this.landscape = landscape;
            setOrientation();
        }
    }

    protected void addWindowInsetsListener(WindowInsetsListener windowInsetsListener) {
        windowInsetsListeners.add(windowInsetsListener);
        requestApplyInsets();
    }

    protected void removeWindowInsetsListener(WindowInsetsListener windowInsetsListener) {
        windowInsetsListeners.remove(windowInsetsListener);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        setOrientation();
    }

    @Override
    public WindowInsets onApplyWindowInsets(WindowInsets insets) {
        insets = super.onApplyWindowInsets(insets);
        for(WindowInsetsListener listener : windowInsetsListeners)
            listener.handleWindowInsets(insets);
        return insets;
    }

    protected void registerDrawerToggleHandler(DrawerToggleHandler drawerToggleHandler) {
        if (drawerToggleHandler instanceof Toolbar toolbarView && toolbar == null)
            this.toolbar = new WeakReference<>(toolbarView);
        if (drawerToggleHandler instanceof DrawerLayoutView drawerView && drawer == null)
            this.drawer = new WeakReference<>(drawerView);
        initDrawerToggle();
    }

    private void initDrawerToggle() {
        if (toolbar != null && drawer != null) {
            Toolbar toolbarView = toolbar.get();
            DrawerLayoutView drawerView = drawer.get();
            if (toolbarView != null && drawerView != null) {
                Activity activity = ((ReactContext) getContext()).getCurrentActivity();
                ActionBarDrawerToggle drawerToggle = new ActionBarDrawerToggle(activity, drawerView, toolbarView, 0, 0);
                drawerToggle.setDrawerIndicatorEnabled(true);
                drawerToggle.syncState();
                ((DrawerToggleHandler) toolbarView).initDrawerToggle(drawerToggle);
                drawerView.initDrawerToggle(drawerToggle);
            }
        }
    }

    private void setOrientation() {
        if (getVisibility() == VISIBLE) {
            Activity activity = ((ReactContext) getContext()).getCurrentActivity();
            activity.setRequestedOrientation(this.landscape ? ActivityInfo.SCREEN_ORIENTATION_USER_LANDSCAPE : ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
        }
    }

    protected void popped() {
        ReactContext reactContext = (ReactContext) getContext();
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
        eventDispatcher.dispatchEvent(new PoppedEvent(getId()));
    }

    @Override
    protected void finalize() throws Throwable {
        super.finalize();
    }

    static class PoppedEvent extends Event<PoppedEvent> {
        public PoppedEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topPopped";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), Arguments.createMap());
        }
    }

    protected interface WindowInsetsListener
    {
        void handleWindowInsets(WindowInsets insets);
    }
}
