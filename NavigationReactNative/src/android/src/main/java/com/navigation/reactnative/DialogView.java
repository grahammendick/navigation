package com.navigation.reactnative;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
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

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

public class DialogView extends ReactViewGroup implements LifecycleOwner {
    private final DialogViewFragment dialogViewFragment;
    DialogRootView dialogRootView;
    boolean show;
    protected String stackId;
    protected ReadableArray ancestorStackIds;
    FragmentController fragmentController;
    private final LifecycleRegistry lifecycleRegistry = new LifecycleRegistry(this);

    public DialogView(Context context) {
        super(context);
        dialogViewFragment = new DialogViewFragment();
        dialogViewFragment.dialogView = this;
        fragmentController = FragmentController.createController(new DialogBackStackCallback());
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
            dialogView.fragmentController.attachHost(null);
            dialogView.fragmentController.dispatchStart();
            dialogView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_START);
        }

        @Override
        public void onPause() {
            super.onPause();
            dialogView.fragmentController.dispatchPause();
            dialogView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_PAUSE);
        }

        @Override
        public void onResume() {
            super.onResume();
            dialogView.fragmentController.dispatchResume();
            dialogView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_RESUME);
        }

        @Override
        public void onDismiss(@NonNull DialogInterface dialog) {
            super.onDismiss(dialog);
            if (dialogView != null) {
                ReactContext reactContext = (ReactContext) dialogView.getContext();
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, dialogView.getId());
                eventDispatcher.dispatchEvent(new DialogView.ShowChangedEvent(dialogView.getId(), false));
                dialogView.fragmentController.dispatchStop();
                dialogView.lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_STOP);
            }
        }

        FragmentManager getSupportFragmentManager() {
            return dialogView.fragmentController.getSupportFragmentManager();
        }
    }

    class DialogBackStackCallback extends FragmentHostCallback<DialogView> implements OnBackPressedDispatcherOwner
    {
        public DialogBackStackCallback() {
            super(DialogView.this.getContext(), new Handler(Looper.getMainLooper()), 0);
        }

        @Override
        public DialogView onGetHost() {
            return DialogView.this;
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
