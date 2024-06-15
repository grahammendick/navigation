package com.navigation.reactnative;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;

import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.JSTouchDispatcher;
import com.facebook.react.uimanager.RootView;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.view.ReactViewGroup;

public class DialogView extends ReactViewGroup {
    private final DialogViewFragment dialogViewFragment;
    final DialogRootView dialogRootView;
    boolean show;
    protected String stackId;
    protected ReadableArray ancestorStackIds;
    private boolean dismissed = true;

    public DialogView(Context context) {
        super(context);
        dialogViewFragment = new DialogViewFragment();
        dialogViewFragment.dialogView = this;
        dialogRootView = new DialogRootView(context);
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
        }
        if (!dismissed && !show)
            dialogViewFragment.dismiss();
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
}
