package com.navigation.reactnative;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.RootView;
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
            FragmentTransaction transaction = fragmentManager.beginTransaction();
            // transaction.setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN);
            transaction.add(dialogViewFragment, stackId);//.addToBackStack(null);
            transaction.commitNowAllowingStateLoss();
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
    }

    static class DialogRootView extends ReactViewGroup implements RootView
    {
        public DialogRootView(Context context) {
            super(context);
        }

        @Override
        public void onChildStartedNativeGesture(View view, MotionEvent motionEvent) {

        }

        @Override
        public void onChildEndedNativeGesture(View view, MotionEvent motionEvent) {

        }

        @Override
        public void handleException(Throwable throwable) {

        }
    }
}
