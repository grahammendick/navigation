package com.navigation.reactnative;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;

import androidx.activity.ComponentDialog;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.WindowCompat;
import androidx.fragment.app.DialogFragment;
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

public class DialogView extends ReactViewGroup {
    private final DialogViewFragment dialogViewFragment;
    DialogRootView dialogRootView;
    int pendingDetent;
    int detent;
    int nativeEventCount;
    int mostRecentEventCount;
    private boolean dismissed = true;
    protected String fragmentTag;
    protected ReadableArray ancestorFragmentTags;

    public DialogView(Context context) {
        super(context);
        dialogViewFragment = new DialogViewFragment();
        dialogViewFragment.dialogView = this;
        dialogRootView = new DialogRootView(context);
        dialogRootView.dialogFragment = dialogViewFragment;
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
            dialogViewFragment.show(fragmentManager, fragmentTag);
            dismissed = false;
        }
        if (!dismissed && detent == BottomSheetBehavior.STATE_HIDDEN) {
            dialogViewFragment.dismiss();
        }
    }

    @Override
    public WindowInsets onApplyWindowInsets(WindowInsets insets) {
        dialogViewFragment.setEdgeToEdge(true);
        return super.onApplyWindowInsets(insets);
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
        if (!dismissed) dialogViewFragment.dismissAllowingStateLoss();
    }

    public static class DialogViewFragment extends DialogFragment implements DialogFragmentController
    {
        private DialogView dialogView;
        private boolean edgeToEdge;
        private boolean hostAttached = false;

        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            return dialogView != null ? dialogView.dialogRootView : new View(getContext());
        }

        @NonNull
        @Override
        public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
            return new ComponentDialog(requireContext(), R.style.ModalSheet);
        }

        @Override
        public void onStart() {
            super.onStart();
            assert getDialog() != null : "Dialog is null";
            Window window = getDialog().getWindow();
            assert window != null : "Window is null";
            setEdgeToEdge(this.edgeToEdge);
            window.setLayout(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
            window.setBackgroundDrawable(null);
            if (!hostAttached && dialogView != null) {
                hostAttached = true;
                dialogView.dialogRootView.fragmentController.attachHost(null);
                dialogView.dialogRootView.fragmentController.dispatchStart();
                dialogView.dialogRootView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_START);
            }
        }

        void setEdgeToEdge(boolean edgeToEdge) {
            this.edgeToEdge = edgeToEdge;
            if (edgeToEdge && getDialog() != null) {
                Window window = getDialog().getWindow();
                assert window != null : "Window is null";
                WindowCompat.setDecorFitsSystemWindows(window, false);
                window.setStatusBarColor(Color.TRANSPARENT);
                window.setNavigationBarColor(Color.TRANSPARENT);

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
                eventDispatcher.dispatchEvent(new DialogView.DetentChangedEvent(dialogView.getId(), dialogView.detent, dialogView.nativeEventCount));
                eventDispatcher.dispatchEvent(new DialogView.DismissedEvent(dialogView.getId()));
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

    static class DetentChangedEvent extends Event<DialogView.DetentChangedEvent> {
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

    static class DismissedEvent extends Event<DialogView.DismissedEvent> {
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
