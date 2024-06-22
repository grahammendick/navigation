package com.navigation.reactnative;

import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Lifecycle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

public class DialogView extends ReactViewGroup {
    private final DialogViewFragment dialogViewFragment;
    DialogRootView dialogRootView;
    boolean show;
    protected String stackId;
    protected ReadableArray ancestorStackIds;

    public DialogView(Context context) {
        super(context);
        dialogViewFragment = new DialogViewFragment();
        dialogViewFragment.dialogView = this;
    }

    void onAfterUpdateTransaction() {
        if (dialogRootView == null) return;
        if (show) {
            FragmentActivity activity = (FragmentActivity) ((ReactContext) getContext()).getCurrentActivity();
            assert activity != null : "Activity is null";
            FragmentManager fragmentManager = activity.getSupportFragmentManager();
            for (int i = 0; i < ancestorStackIds.size(); i++) {
                Fragment ancestorFragment = fragmentManager.findFragmentByTag(ancestorStackIds.getString(i));
                if (ancestorFragment == null) return;
                fragmentManager = ancestorFragment.getChildFragmentManager();
            }
            dialogRootView.dialogFragment = dialogViewFragment;
            dialogViewFragment.show(fragmentManager, stackId);
        } else {
            dialogViewFragment.dismiss();
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        dialogViewFragment.dismissAllowingStateLoss();
    }

    public static class DialogViewFragment extends DialogFragment
    {
        private DialogView dialogView;

        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
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
            ReactContext reactContext = (ReactContext) dialogView.getContext();
            EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, dialogView.getId());
            eventDispatcher.dispatchEvent(new DialogView.ShowChangedEvent(dialogView.getId(), true));
            dialogView.dialogRootView.fragmentController.attachHost(null);
            dialogView.dialogRootView.fragmentController.dispatchStart();
            dialogView.dialogRootView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_START);
        }

        @Override
        public void onPause() {
            super.onPause();
            dialogView.dialogRootView.fragmentController.dispatchPause();
            dialogView.dialogRootView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_PAUSE);
        }

        @Override
        public void onResume() {
            super.onResume();
            dialogView.dialogRootView.fragmentController.dispatchResume();
            dialogView.dialogRootView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_RESUME);
        }

        @Override
        public void onDismiss(@NonNull DialogInterface dialog) {
            super.onDismiss(dialog);
            if (dialogView != null) {
                ReactContext reactContext = (ReactContext) dialogView.getContext();
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, dialogView.getId());
                eventDispatcher.dispatchEvent(new DialogView.ShowChangedEvent(dialogView.getId(), false));
            }
        }

        @Override
        public void onDestroyView() {
            super.onDestroyView();
            dialogView.dialogRootView.fragmentController.dispatchStop();
            dialogView.dialogRootView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_STOP);
        }

        FragmentManager getSupportFragmentManager() {
            return dialogView.dialogRootView.fragmentController.getSupportFragmentManager();
        }
    }

    static class ShowChangedEvent extends Event<DialogView.ShowChangedEvent> {
        private final boolean show;

        public ShowChangedEvent(int viewId, boolean show) {
            super(viewId);
            this.show = show;
        }

        @Override
        public String getEventName() {
            return "topShowChanged";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putBoolean("show", this.show);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }
}
