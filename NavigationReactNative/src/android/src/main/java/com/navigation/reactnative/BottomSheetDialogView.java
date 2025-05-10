package com.navigation.reactnative;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Lifecycle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.StateWrapper;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

public class BottomSheetDialogView extends ReactViewGroup {
    private final BottomSheetFragment bottomSheetFragment;
    BottomSheetBehavior<FrameLayout> bottomSheetBehavior;
    final DialogRootView dialogRootView;
    float defaultHalfExpandedRatio;
    int pendingDetent;
    int detent;
    int nativeEventCount;
    int mostRecentEventCount;
    private boolean dismissed = true;
    protected String fragmentTag;
    protected ReadableArray ancestorFragmentTags;

    public BottomSheetDialogView(Context context) {
        super(context);
        bottomSheetFragment = new BottomSheetFragment();
        bottomSheetBehavior = new BottomSheetBehavior<>();
        bottomSheetBehavior.setPeekHeight(BottomSheetBehavior.PEEK_HEIGHT_AUTO);
        bottomSheetFragment.dialogView = this;
        bottomSheetBehavior.setFitToContents(false);
        dialogRootView = new DialogRootView(context);
        dialogRootView.dialogFragment = bottomSheetFragment;
        defaultHalfExpandedRatio = bottomSheetBehavior.getHalfExpandedRatio();
    }

    @Override
    public void setId(int id) {
        super.setId(id);
        dialogRootView.setId(id);
    }

    void onAfterUpdateTransaction() {
        nativeEventCount = Math.max(nativeEventCount, mostRecentEventCount);
        int eventLag = nativeEventCount - mostRecentEventCount;
        if (eventLag == 0) {
            detent = pendingDetent;
        }
        if (bottomSheetBehavior.getState() != detent && detent != BottomSheetBehavior.STATE_HIDDEN)
            bottomSheetBehavior.setState(detent);
        if (dismissed && detent != BottomSheetBehavior.STATE_HIDDEN) {
            FragmentActivity activity = (FragmentActivity) ((ReactContext) getContext()).getCurrentActivity();
            assert activity != null : "Activity is null";
            FragmentManager fragmentManager = activity.getSupportFragmentManager();
            for (int i = 0; i < ancestorFragmentTags.size(); i++) {
                Fragment ancestorFragment = fragmentManager.findFragmentByTag(ancestorFragmentTags.getString(i));
                if (ancestorFragment == null) return;
                if (!(ancestorFragment instanceof DialogFragmentController dialogFragmentController))
                    fragmentManager = ancestorFragment.getChildFragmentManager();
                else
                    fragmentManager = dialogFragmentController.getSupportFragmentManager();
            }
            bottomSheetFragment.show(fragmentManager, fragmentTag);
            dismissed = false;
        }
        if (!dismissed && detent == BottomSheetBehavior.STATE_HIDDEN) {
            bottomSheetFragment.dismiss();
        }
    }

    @Nullable
    public StateWrapper getStateWrapper() {
        return dialogRootView.getStateWrapper();
    }

    public void setStateWrapper(StateWrapper stateWrapper) {
        dialogRootView.setStateWrapper(stateWrapper);
    }

    public void updateState(final int width, final int height) {
        dialogRootView.updateState(width, height);
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        if (!dismissed) bottomSheetFragment.dismissAllowingStateLoss();
    }

    public static class BottomSheetFragment extends BottomSheetDialogFragment implements DialogFragmentController {
        private BottomSheetDialogView dialogView;
        private BottomSheetBehavior.BottomSheetCallback bottomSheetCallback;
        private boolean hostAttached = false;

        @SuppressLint({"Range", "WrongConstant"})
        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            if (bottomSheetCallback == null && dialogView != null) {
                BottomSheetBehavior<FrameLayout> behavior = ((BottomSheetDialog) getDialog()).getBehavior();
                behavior.setPeekHeight(dialogView.bottomSheetBehavior.getPeekHeight());
                behavior.setExpandedOffset(dialogView.bottomSheetBehavior.getExpandedOffset());
                behavior.setFitToContents(dialogView.bottomSheetBehavior.isFitToContents());
                behavior.setHalfExpandedRatio(dialogView.bottomSheetBehavior.getHalfExpandedRatio());
                behavior.setHideable(dialogView.bottomSheetBehavior.isHideable());
                behavior.setSkipCollapsed(dialogView.bottomSheetBehavior.getSkipCollapsed());
                behavior.setDraggable(dialogView.bottomSheetBehavior.isDraggable());
                behavior.setState(dialogView.bottomSheetBehavior.getState());
                bottomSheetCallback = new BottomSheetBehavior.BottomSheetCallback() {
                    @Override
                    public void onStateChanged(@NonNull View view, int i) {
                        dialogView.nativeEventCount++;
                        dialogView.detent = i;
                        ReactContext reactContext = (ReactContext) dialogView.getContext();
                        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, dialogView.getId());
                        eventDispatcher.dispatchEvent(new BottomSheetDialogView.DetentChangedEvent(dialogView.getId(), dialogView.detent, dialogView.nativeEventCount));
                    }

                    @Override
                    public void onSlide(@NonNull View view, float v) {
                    }
                };
                behavior.addBottomSheetCallback(bottomSheetCallback);
                dialogView.bottomSheetBehavior = behavior;
            }
            return dialogView != null ? dialogView.dialogRootView : new View(getContext());
        }

        @Override
        public void onStart() {
            super.onStart();
            assert getDialog() != null : "Dialog is null";
            Window window = getDialog().getWindow();
            assert window != null : "Window is null";
            window.setLayout(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
            window.setBackgroundDrawable(null);
            if (!hostAttached && dialogView != null) {
                hostAttached = true;
                ((View) dialogView.dialogRootView.getParent()).setBackgroundColor(Color.TRANSPARENT);
                dialogView.dialogRootView.fragmentController.attachHost(null);
                dialogView.dialogRootView.fragmentController.dispatchStart();
                dialogView.dialogRootView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_START);
            }
        }

        @Override
        public void onPause() {
            super.onPause();
            if (dialogView != null) {
                dialogView.dialogRootView.fragmentController.dispatchPause();
                dialogView.dialogRootView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_PAUSE);
            }
        }

        @Override
        public void onResume() {
            super.onResume();
            if (dialogView != null) {
                dialogView.dialogRootView.fragmentController.dispatchResume();
                dialogView.dialogRootView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_RESUME);
            } else {
                this.dismissAllowingStateLoss();
            }
        }

        @Override
        public void onDismiss(@NonNull DialogInterface dialog) {
            super.onDismiss(dialog);
            if (dialogView != null) {
                dialogView.nativeEventCount++;
                dialogView.detent = BottomSheetBehavior.STATE_HIDDEN;
                dialogView.dismissed = true;
                ReactContext reactContext = (ReactContext) dialogView.getContext();
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, dialogView.getId());
                eventDispatcher.dispatchEvent(new BottomSheetDialogView.DetentChangedEvent(dialogView.getId(), dialogView.detent, dialogView.nativeEventCount));
                eventDispatcher.dispatchEvent(new BottomSheetDialogView.DismissedEvent(dialogView.getId()));
            }
        }

        @Override
        public void onStop() {
            super.onStop();
            if (dialogView != null) {
                dialogView.dialogRootView.fragmentController.dispatchStop();
                dialogView.dialogRootView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_STOP);
            }
        }

        @Override
        public void onDestroyView() {
            super.onDestroyView();
            if (dialogView != null)
                dialogView.dialogRootView.fragmentController.dispatchDestroyView();
        }

        @Override
        public void onDestroy() {
            super.onDestroy();
            if (dialogView != null) {
                dialogView.dialogRootView.fragmentController.dispatchDestroy();
                dialogView.dialogRootView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY);
            }
        }

        public FragmentManager getSupportFragmentManager() {
            return dialogView.dialogRootView.fragmentController.getSupportFragmentManager();
        }
    }

    static class DetentChangedEvent extends Event<BottomSheetDialogView.DetentChangedEvent> {
        private final int detent;
        private final int eventCount;

        public DetentChangedEvent(int viewId, int detent, int eventCount) {
            super(viewId);
            this.detent = detent;
            this.eventCount = eventCount;
        }

        @Override
        public String getEventName() {
            return "topDetentChanged";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putInt("detent", this.detent);
            event.putInt("eventCount", this.eventCount);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }

    static class DismissedEvent extends Event<BottomSheetDialogView.DismissedEvent> {
        public DismissedEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topDismissed";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), Arguments.createMap());
        }
    }
}
