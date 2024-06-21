package com.navigation.reactnative;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
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
import com.facebook.react.views.view.ReactViewGroup;

public class SheetView extends ReactViewGroup {
    private final SheetViewFragment sheetViewFragment;
    boolean show;
    protected String stackId;
    protected ReadableArray ancestorStackIds;
    Fragment fragment;

    public SheetView(Context context) {
        super(context);
        sheetViewFragment = new SheetViewFragment();
        sheetViewFragment.sheetView = this;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (show) {
            FragmentActivity activity = (FragmentActivity) ((ReactContext) getContext()).getCurrentActivity();
            assert activity != null : "Activity is null";
            FragmentManager fragmentManager = activity.getSupportFragmentManager();
            for (int i = 0; i < ancestorStackIds.size(); i++) {
                Fragment ancestorFragment = fragmentManager.findFragmentByTag(ancestorStackIds.getString(i));
                if (ancestorFragment == null) return;
                fragmentManager = ancestorFragment.getChildFragmentManager();
            }
            fragment = new SheetFragment(this);
            FragmentTransaction transaction = fragmentManager.beginTransaction();
            transaction
                .add(fragment, stackId)
                .setPrimaryNavigationFragment(fragment)
                .commitNowAllowingStateLoss();
            transaction = fragmentManager.beginTransaction();
            transaction
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .add(this.getId(), sheetViewFragment)
                .addToBackStack(null)
                .commit();
        } else {
            sheetViewFragment.dismiss();
        }
    }

    public static class SheetFragment extends Fragment {
        private SheetView sheetView;

        public SheetFragment() {
            super();
        }

        SheetFragment(SheetView sheetView) {
            super();
            this.sheetView = sheetView;
        }

        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            return sheetView != null ? sheetView : new View(getContext());
        }
    }

    public static class SheetViewFragment extends DialogFragment
    {
        private SheetView sheetView;

        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            if (sheetView != null) {
                View view = sheetView.getChildAt(0);
                sheetView.removeView(view);
                return view;
            }
            return new View(getContext());
        }
    }

}
