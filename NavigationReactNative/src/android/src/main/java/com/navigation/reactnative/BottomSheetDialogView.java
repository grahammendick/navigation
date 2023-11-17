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

import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

public class BottomSheetDialogView extends ReactViewGroup {
    private BottomSheetFragment bottomSheetFragment;
    SheetView sheetView;
    public BottomSheetDialogView(Context context) {
        super(context);
        bottomSheetFragment = new BottomSheetFragment();
        sheetView = new SheetView(context);
    }

    protected BottomSheetBehavior<FrameLayout> getBehavior() {
        return ((BottomSheetDialog) bottomSheetFragment.getDialog()).getBehavior();
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
        FragmentManager fragmentManager = ((FragmentActivity) currentActivity).getSupportFragmentManager();
        bottomSheetFragment.sheetView = sheetView;
        bottomSheetFragment.show(fragmentManager, "BottomSheetDialog");
    }

    public static class BottomSheetFragment extends BottomSheetDialogFragment {
        private SheetView sheetView;

        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            return sheetView != null ? sheetView : new View(getContext());
        }
    }

    static class SheetView extends ReactViewGroup
    {
        private boolean hasAdjustedSize = false;
        private int viewWidth;
        private int viewHeight;
        public SheetView(Context context) {
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
                hasAdjustedSize = false;
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
            } else {
                hasAdjustedSize = true;
            }
        }

        @Override
        public void addView(View child, int index, LayoutParams params) {
            super.addView(child, index, params);
            if (hasAdjustedSize) {
                updateFirstChildView();
            }
        }
    }
}
