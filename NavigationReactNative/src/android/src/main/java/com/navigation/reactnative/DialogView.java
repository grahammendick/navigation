package com.navigation.reactnative;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

import androidx.activity.ComponentDialog;
import androidx.activity.OnBackPressedDispatcher;
import androidx.activity.OnBackPressedDispatcherOwner;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentController;
import androidx.fragment.app.FragmentHostCallback;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.LifecycleRegistry;

import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.JSTouchDispatcher;
import com.facebook.react.uimanager.RootView;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.view.ReactViewGroup;

public class DialogView extends ReactViewGroup implements LifecycleOwner {
    private final DialogViewFragment dialogViewFragment;
    final DialogRootView dialogRootView;
    boolean show;
    protected String stackId;
    protected ReadableArray ancestorStackIds;
    private boolean dismissed = true;
    FragmentController fragmentController;
    private final LifecycleRegistry lifecycleRegistry = new LifecycleRegistry(this);

    public DialogView(Context context) {
        super(context);
        dialogViewFragment = new DialogViewFragment();
        dialogViewFragment.dialogView = this;
        dialogRootView = new DialogRootView(context);
        fragmentController = FragmentController.createController(new DialogBackStackCallback());
    }

    void onAfterUpdateTransaction() {
        if (dismissed && show) {
            FragmentActivity activity = (FragmentActivity) ((ReactContext) getContext()).getCurrentActivity();
            assert activity != null : "Activity is null";
            FragmentManager fragmentManager = activity.getSupportFragmentManager();
            for (int i = 0; i < ancestorStackIds.size(); i++) {
                Fragment ancestorFragment = fragmentManager.findFragmentByTag(ancestorStackIds.getString(i));
                assert ancestorFragment != null : "Ancestor fragment is null";
                fragmentManager = ancestorFragment.getChildFragmentManager();
            }
            dialogViewFragment.showNow(fragmentManager, stackId);
            dismissed = false;
        }
        if (!dismissed && !show)
            dialogViewFragment.dismiss();
    }

    @NonNull
    @Override
    public Lifecycle getLifecycle() {
        return lifecycleRegistry;
    }

    public static class DialogViewFragment extends DialogFragment
    {
        private DialogView dialogView;

        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            return dialogView != null ? dialogView.dialogRootView : new View(getContext());
        }

        @NonNull
        @Override
        public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
            Dialog dialog = super.onCreateDialog(savedInstanceState);
            dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
            return dialog;
        }

        @Override
        public void onStart() {
            super.onStart();
            assert getDialog() != null : "Dialog is null";
            Window window = getDialog().getWindow();
            assert window != null : "Window is null";
            window.setLayout(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
            window.setBackgroundDrawable(null);
        }

        FragmentManager getSupportFragmentManager() {
            dialogView.fragmentController.attachHost(null);
            dialogView.fragmentController.dispatchStart();
            return dialogView.fragmentController.getSupportFragmentManager();
        }
    }

    static class DialogRootView extends ReactViewGroup implements RootView
    {
        private int viewWidth;
        private int viewHeight;
        private final JSTouchDispatcher jsTouchDispatcher = new JSTouchDispatcher(this);
        EventDispatcher eventDispatcher;

        public DialogRootView(Context context) {
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
                final int viewTag = getChildAt(0).getId();
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
                            uiManager.updateNodeSize(viewTag, viewWidth, viewHeight);
                        }
                    });
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
    }

    class DialogBackStackCallback extends FragmentHostCallback<DialogView> implements OnBackPressedDispatcherOwner
    {
        public DialogBackStackCallback() {
            super(DialogView.this.getContext(), new Handler(Looper.getMainLooper()), 0);
        }

        @Override
        public DialogView onGetHost() {
            return null;
        }

        @NonNull
        @Override
        public Lifecycle getLifecycle() {
            return lifecycleRegistry;
        }

        @NonNull
        @Override
        public LayoutInflater onGetLayoutInflater() {
            Dialog dialog = dialogViewFragment.getDialog();
            assert dialog != null : "Dialog is null";
            Window window = dialog.getWindow();
            assert window != null : "Window is null";
            return window.getLayoutInflater().cloneInContext(DialogView.this.getContext());
        }

        @NonNull
        @Override
        public OnBackPressedDispatcher getOnBackPressedDispatcher() {
            ComponentDialog componentDialog = (ComponentDialog) dialogViewFragment.getDialog();
            assert componentDialog != null : "Dialog is null";
            return componentDialog.getOnBackPressedDispatcher();
        }
    }
}
