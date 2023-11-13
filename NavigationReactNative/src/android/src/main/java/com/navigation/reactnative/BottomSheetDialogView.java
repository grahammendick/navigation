package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

public class BottomSheetDialogView extends ReactViewGroup {
    private BottomSheetFragment bottomSheetFragment;
    View sheet;
    public BottomSheetDialogView(Context context) {
        super(context);
        bottomSheetFragment = new BottomSheetFragment();
    }

    protected BottomSheetBehavior<FrameLayout> getBehavior() {
        return ((BottomSheetDialog) bottomSheetFragment.getDialog()).getBehavior();
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
        FragmentManager fragmentManager = ((FragmentActivity) currentActivity).getSupportFragmentManager();
        bottomSheetFragment.sheet = sheet;
        bottomSheetFragment.show(fragmentManager, "BottomSheetDialog");
    }

    public static class BottomSheetFragment extends BottomSheetDialogFragment {
        private View sheet;

        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            return sheet != null ? sheet : new View(getContext());
        }
    }
}
