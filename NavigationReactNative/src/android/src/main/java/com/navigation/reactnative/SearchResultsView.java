package com.navigation.reactnative;

import android.content.Context;
import android.content.ContextWrapper;
import android.graphics.drawable.Drawable;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;

import androidx.core.view.ViewCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.search.SearchView;

public class SearchResultsView extends SearchView {
    Drawable defaultBackground;
    private boolean layoutRequested = false;
    private String pendingText;
    private boolean pendingActive;
    int nativeEventCount;
    int mostRecentEventCount;
    int nativeActiveEventCount;
    int mostRecentActiveEventCount;

    public SearchResultsView(Context context) {
        super(context);
        ViewCompat.setLayoutDirection(this, !I18nUtil.getInstance().isRTL(context) ? ViewCompat.LAYOUT_DIRECTION_LTR : ViewCompat.LAYOUT_DIRECTION_RTL);
        defaultBackground = getToolbar().getBackground();
        addTransitionListener((searchView, previousState, newState) -> {
            if (newState == TransitionState.SHOWING) {
                nativeActiveEventCount++;
                ReactContext reactContext = (ReactContext) ((ContextWrapper) getContext()).getBaseContext();
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
                eventDispatcher.dispatchEvent(new SearchResultsView.ChangeActiveEvent(getId(), true, nativeActiveEventCount));
            }
            if (newState == TransitionState.HIDDEN) {
                nativeActiveEventCount++;
                ReactContext reactContext = (ReactContext) ((ContextWrapper) getContext()).getBaseContext();
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
                eventDispatcher.dispatchEvent(new SearchResultsView.ChangeActiveEvent(getId(), false, nativeActiveEventCount));
            }
        });
        getEditText().addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                nativeEventCount++;
                ReactContext reactContext = (ReactContext) ((ContextWrapper) getContext()).getBaseContext();
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
                eventDispatcher.dispatchEvent(new SearchResultsView.ChangeTextEvent(getId(), charSequence.toString(), nativeEventCount));
            }

            @Override
            public void afterTextChanged(Editable editable) {
            }
        });
        getEditText().setOnEditorActionListener((textView, i, keyEvent) -> {
            ReactContext reactContext = (ReactContext) ((ContextWrapper) getContext()).getBaseContext();
            EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
            eventDispatcher.dispatchEvent(new SearchResultsView.QueryEvent(getId(), getText().toString()));
            return false;
        });
    }

    void setText(String text) {
        pendingText = text;
    }

    void setActive(boolean active) {
        pendingActive = active;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (isShowing()) post(focusAndKeyboard);
        ViewGroup view = (ViewGroup) getParent();
        for(int i = 0; i < view.getChildCount(); i++) {
            if (view.getChildAt(i) instanceof NavigationBarView) {
                setupWithSearchBar((SearchToolbarView) ((NavigationBarView) view.getChildAt(i)).getChildAt(0));
            }
        }
    }

    void onAfterUpdateTransaction() {
        int eventLag = nativeEventCount - mostRecentEventCount;
        if (eventLag == 0 && pendingText != null && !getEditText().getText().toString().equals(pendingText)) {
            getEditText().setText(pendingText);
        }
        int activeEventLag = nativeActiveEventCount - mostRecentActiveEventCount;
        if (activeEventLag == 0 && isShowing() != pendingActive)
            if (pendingActive) show();
            else hide();
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        if (!layoutRequested) {
            layoutRequested = true;
            post(measureAndLayout);
        }
    }

    private final Runnable measureAndLayout = () -> {
        layoutRequested = false;
        measure(
            MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
    };

    private final Runnable focusAndKeyboard = new Runnable() {
        @Override
        public void run() {
            if (getEditText().requestFocus()) {
                InputMethodManager inputMethodManager = (InputMethodManager) getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
                if (inputMethodManager != null)
                    inputMethodManager.showSoftInput(getEditText().findFocus(), 0);
            }
        }
    };

    static class ChangeTextEvent extends Event<SearchBarView.ChangeTextEvent> {
        private final String text;
        private final int eventCount;

        public ChangeTextEvent(int viewId, String text, int eventCount) {
            super(viewId);
            this.text = text;
            this.eventCount = eventCount;
        }

        @Override
        public String getEventName() {
            return "topOnChangeText";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putString("text", this.text);
            event.putInt("eventCount", this.eventCount);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }

    static class ChangeActiveEvent extends Event<SearchResultsView.ChangeActiveEvent> {
        private final boolean active;
        private final int eventCount;
        public ChangeActiveEvent(int viewId, boolean active, int eventCount) {
            super(viewId);
            this.active = active;
            this.eventCount = eventCount;
        }

        @Override
        public String getEventName() {
            return "topOnChangeActive";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putBoolean("active", this.active);
            event.putInt("eventCount", this.eventCount);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }

    static class QueryEvent extends Event<SearchBarView.ChangeTextEvent> {
        private final String text;

        public QueryEvent(int viewId, String text) {
            super(viewId);
            this.text = text;
        }

        @Override
        public String getEventName() {
            return "topOnQuery";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            WritableMap event = Arguments.createMap();
            event.putString("text", this.text);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
        }
    }
}
