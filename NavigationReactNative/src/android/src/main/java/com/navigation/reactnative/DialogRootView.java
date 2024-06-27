package com.navigation.reactnative;

import android.app.Dialog;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;

import androidx.activity.ComponentDialog;
import androidx.activity.OnBackPressedDispatcher;
import androidx.activity.OnBackPressedDispatcherOwner;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.UiThread;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.FragmentController;
import androidx.fragment.app.FragmentHostCallback;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.LifecycleRegistry;

import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.JSTouchDispatcher;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.RootView;
import com.facebook.react.uimanager.StateWrapper;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.view.ReactViewGroup;

public class DialogRootView extends ReactViewGroup implements RootView, LifecycleOwner {
    private int viewWidth;
    private int viewHeight;
    private int expandedOffset = 0;
    private final JSTouchDispatcher jsTouchDispatcher = new JSTouchDispatcher(this);
    EventDispatcher eventDispatcher;
    private StateWrapper stateWrapper = null;
    FragmentController fragmentController;
    final LifecycleRegistry lifecycleRegistry = new LifecycleRegistry(this);
    DialogFragment dialogFragment;
    DialogBackStackCallback dialogBackStackCallback = new DialogBackStackCallback();

    public DialogRootView(Context context) {
        super(context);
        setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
        fragmentController = FragmentController.createController(dialogBackStackCallback);
    }

    public void setExpandedOffset(int expandedOffset) {
        this.expandedOffset = expandedOffset;
        updateFirstChildView();
    }

    public void setExpandedHeight(int expandedHeight) {
        getLayoutParams().height = expandedHeight;
        updateFirstChildView();
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
            final int viewTag = getChildAt(0).getId();
            if (stateWrapper != null) {
                updateState(viewWidth, getLayoutParams().height > 0 ? getLayoutParams().height : viewHeight - expandedOffset);
            } else {
                ThemedReactContext reactContext = (ThemedReactContext) getContext();
                reactContext.runOnNativeModulesQueueThread(
                    new GuardedRunnable(reactContext) {
                        @Override
                        public void runGuarded() {
                            UIManagerModule uiManager = ((ThemedReactContext) getContext())
                                .getReactApplicationContext()
                                .getNativeModule(UIManagerModule.class);
                            if (uiManager == null) {
                                return;
                            }
                            uiManager.updateNodeSize(viewTag, viewWidth, getLayoutParams().height > 0 ? getLayoutParams().height : viewHeight - expandedOffset);
                        }
                    });
            }
        }
    }

    @UiThread
    public void updateState(final int width, final int height) {
        final float realWidth = PixelUtil.toDIPFromPixel(width);
        final float realHeight = PixelUtil.toDIPFromPixel(height);
        ReadableMap currentState = stateWrapper.getStateData();
        if (currentState != null) {
            float delta = (float) 0.9;
            float stateScreenHeight =
                    currentState.hasKey("frameHeight")
                            ? (float) currentState.getDouble("frameHeight")
                            : 0;
            float stateScreenWidth =
                    currentState.hasKey("frameWidth") ? (float) currentState.getDouble("frameWidth") : 0;

            if (Math.abs(stateScreenWidth - realWidth) < delta
                    && Math.abs(stateScreenHeight - realHeight) < delta) {
                return;
            }
        }
        if (stateWrapper != null) {
            WritableMap map = new WritableNativeMap();
            map.putDouble("frameWidth", realWidth);
            map.putDouble("frameHeight", realHeight);
            stateWrapper.updateState(map);
        }
    }

    @Override
    public void addView(View child, int index, LayoutParams params) {
        super.addView(child, index, params);
        updateFirstChildView();
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent event) {
        jsTouchDispatcher.handleTouchEvent(event, eventDispatcher);
        return super.onInterceptTouchEvent(event);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        jsTouchDispatcher.handleTouchEvent(event, eventDispatcher);
        super.onTouchEvent(event);
        return true;
    }

    @Override
    public void onChildStartedNativeGesture(View view, MotionEvent motionEvent) {
        jsTouchDispatcher.onChildStartedNativeGesture(motionEvent, eventDispatcher);
    }

    @Override
    public void onChildStartedNativeGesture(MotionEvent motionEvent) {
        this.onChildStartedNativeGesture(null, motionEvent);
    }

    @Override
    public void onChildEndedNativeGesture(View view, MotionEvent motionEvent) {
        jsTouchDispatcher.onChildEndedNativeGesture(motionEvent, eventDispatcher);
    }

    @Override
    public void handleException(Throwable throwable) {
        ((ThemedReactContext) getContext()).getReactApplicationContext().handleException(new RuntimeException(throwable));
    }

    @Override
    public void requestDisallowInterceptTouchEvent(boolean disallowIntercept) {
    }

    @Nullable
    public StateWrapper getStateWrapper() {
        return this.stateWrapper;
    }

    public void setStateWrapper(StateWrapper stateWrapper) {
        this.stateWrapper = stateWrapper;
    }


    @NonNull
    @Override
    public Lifecycle getLifecycle() {
        return lifecycleRegistry;
    }

    class DialogBackStackCallback extends FragmentHostCallback<DialogRootView> implements OnBackPressedDispatcherOwner
    {
        public DialogBackStackCallback() {
            super(DialogRootView.this.getContext(), new Handler(Looper.getMainLooper()), 0);
        }

        @Override
        public DialogRootView onGetHost() {
            return DialogRootView.this;
        }

        @NonNull
        @Override
        public Lifecycle getLifecycle() {
            return lifecycleRegistry;
        }

        @NonNull
        @Override
        public LayoutInflater onGetLayoutInflater() {
            Dialog dialog = dialogFragment.getDialog();
            assert dialog != null : "Dialog is null";
            Window window = dialog.getWindow();
            assert window != null : "Window is null";
            return window.getLayoutInflater().cloneInContext(DialogRootView.this.getContext());
        }

        @NonNull
        @Override
        public OnBackPressedDispatcher getOnBackPressedDispatcher() {
            ComponentDialog componentDialog = (ComponentDialog) dialogFragment.getDialog();
            assert componentDialog != null : "Dialog is null";
            return componentDialog.getOnBackPressedDispatcher();
        }
    }
}
