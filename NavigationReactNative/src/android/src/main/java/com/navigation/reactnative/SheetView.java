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

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.material.bottomsheet.BottomSheetBehavior;

public class SheetView extends ReactViewGroup {
    private final SheetViewFragment sheetViewFragment;
    int pendingDetent;
    int detent;
    int nativeEventCount;
    int mostRecentEventCount;
    private boolean dismissed = true;
    protected String stackId;
    protected ReadableArray ancestorStackIds;
    protected int crumb;
    Fragment fragment;
    View container;

    public SheetView(Context context) {
        super(context);
        sheetViewFragment = new SheetViewFragment();
        sheetViewFragment.sheetView = this;
    }

    void onAfterUpdateTransaction() {
        nativeEventCount = Math.max(nativeEventCount, mostRecentEventCount);
        int eventLag = nativeEventCount - mostRecentEventCount;
        if (eventLag == 0) {
            detent = pendingDetent;
        }
        if (container == null) return;
        if (dismissed && detent != BottomSheetBehavior.STATE_HIDDEN) {
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
                .addToBackStack(String.valueOf(crumb))
                .commit();
            dismissed = false;
        }
        if (!dismissed && detent == BottomSheetBehavior.STATE_HIDDEN) {
            sheetViewFragment.dismiss();
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        FragmentManager fragmentManager = fragment.getParentFragmentManager();
        if (fragmentManager.getPrimaryNavigationFragment() != fragment) {
            FragmentTransaction transaction = fragmentManager
                .beginTransaction()
                .setPrimaryNavigationFragment(fragment);
            try {
                transaction.commitNowAllowingStateLoss();
            } catch(IllegalStateException ignored) {
                transaction.commit();
            }
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        FragmentManager fragmentManager = fragment.getParentFragmentManager();
        if (fragmentManager.getPrimaryNavigationFragment() == fragment) {
            FragmentTransaction transaction = fragmentManager
                .beginTransaction()
                .setPrimaryNavigationFragment(null);
            try {
                transaction.commitNowAllowingStateLoss();
            } catch(IllegalStateException ignored) {
            }
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
            return sheetView != null ? sheetView.container : new View(getContext());
        }

        @Override
        public void onDestroy() {
            super.onDestroy();
            if (sheetView != null) {
                sheetView.nativeEventCount++;
                sheetView.detent = BottomSheetBehavior.STATE_HIDDEN;
                sheetView.dismissed = true;
                ReactContext reactContext = (ReactContext) sheetView.getContext();
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, sheetView.getId());
                eventDispatcher.dispatchEvent(new SheetView.DetentChangedEvent(sheetView.getId(), sheetView.detent, sheetView.nativeEventCount));
                eventDispatcher.dispatchEvent(new SheetView.DismissedEvent(sheetView.getId()));
            }
        }
    }

    static class DetentChangedEvent extends Event<SheetView.DetentChangedEvent> {
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

    static class DismissedEvent extends Event<SheetView.DismissedEvent> {
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
