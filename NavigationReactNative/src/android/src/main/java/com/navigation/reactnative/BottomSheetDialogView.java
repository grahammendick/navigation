package com.navigation.reactnative;

import android.annotation.SuppressLint;
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

import java.util.Objects;

public class BottomSheetDialogView extends ReactViewGroup {
    private final BottomSheetFragment bottomSheetFragment;
    private final BottomSheetBehavior<FrameLayout> bottomSheetBehavior;
    final SheetView sheetView;
    float defaultHalfExpandedRatio;
    public BottomSheetDialogView(Context context) {
        super(context);
        bottomSheetFragment = new BottomSheetFragment();
        bottomSheetBehavior = new BottomSheetBehavior<>();
        bottomSheetBehavior.setFitToContents(false);
        sheetView = new SheetView(context);
        defaultHalfExpandedRatio = bottomSheetBehavior.getHalfExpandedRatio();
    }

    protected BottomSheetBehavior<FrameLayout> getBehavior() {
        if (bottomSheetFragment.getDialog() != null)
            return ((BottomSheetDialog) bottomSheetFragment.getDialog()).getBehavior();
        else
            return bottomSheetBehavior;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
        FragmentManager fragmentManager = ((FragmentActivity) Objects.requireNonNull(currentActivity)).getSupportFragmentManager();
        bottomSheetFragment.sheetView = sheetView;
        bottomSheetFragment.bottomSheetBehavior = bottomSheetBehavior;
        bottomSheetFragment.show(fragmentManager, "BottomSheetDialog");
    }

    public static class BottomSheetFragment extends BottomSheetDialogFragment {
        private SheetView sheetView;
        private BottomSheetBehavior<FrameLayout> bottomSheetBehavior;

        @SuppressLint("Range")
        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            BottomSheetBehavior<FrameLayout> behavior = ((BottomSheetDialog) Objects.requireNonNull(getDialog())).getBehavior();
            behavior.setPeekHeight(bottomSheetBehavior.getPeekHeight());
            behavior.setExpandedOffset(bottomSheetBehavior.getExpandedOffset());
            behavior.setFitToContents(bottomSheetBehavior.isFitToContents());
            behavior.setHalfExpandedRatio(bottomSheetBehavior.getHalfExpandedRatio());
            behavior.setHideable(bottomSheetBehavior.isHideable());
            behavior.setSkipCollapsed(bottomSheetBehavior.getSkipCollapsed());
            behavior.setDraggable(bottomSheetBehavior.isDraggable());
            return sheetView != null ? sheetView : new View(getContext());
        }
    }

    static class SheetView extends ReactViewGroup
    {
        private boolean hasAdjustedSize = false;
        private int viewWidth;
        private int viewHeight;
        private int expandedOffset = 0;
        public SheetView(Context context) {
            super(context);
        }

        public void setExpandedOffset(int expandedOffset) {
            this.expandedOffset = expandedOffset;
            updateFirstChildView();
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
                            uiManager.updateNodeSize(viewTag, viewWidth, viewHeight - expandedOffset);
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
