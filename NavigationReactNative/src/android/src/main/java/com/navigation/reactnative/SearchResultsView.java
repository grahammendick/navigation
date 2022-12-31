package com.navigation.reactnative;

import android.content.Context;
import android.content.ContextWrapper;
import android.view.ViewGroup;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.material.search.SearchView;

public class SearchResultsView extends SearchView {

    public SearchResultsView(Context context) {
        super(context);
        addTransitionListener((searchView, previousState, newState) -> {
            if (newState == TransitionState.SHOWING) {
                ReactContext reactContext = (ReactContext) ((ContextWrapper) getContext()).getBaseContext();
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
                eventDispatcher.dispatchEvent(new SearchResultsView.ExpandEvent(getId()));
            }
            if (newState == TransitionState.HIDING) {
                ReactContext reactContext = (ReactContext) ((ContextWrapper) getContext()).getBaseContext();
                EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
                eventDispatcher.dispatchEvent(new SearchResultsView.CollapseEvent(getId()));
            }
        });
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        ViewGroup view = (ViewGroup) getParent();
        for(int i = 0; i < view.getChildCount(); i++) {
            if (view.getChildAt(i) instanceof NavigationBarView) {
                setupWithSearchBar((SearchToolbarView) ((NavigationBarView) view.getChildAt(i)).getChildAt(0));
            }
        }
    }

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

    static class ExpandEvent extends Event<SearchBarView.ExpandEvent> {
        public ExpandEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topOnExpand";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
        }
    }

    static class CollapseEvent extends Event<SearchBarView.CollapseEvent> {
        public CollapseEvent(int viewId) {
            super(viewId);
        }

        @Override
        public String getEventName() {
            return "topOnCollapse";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
        }
    }
}
