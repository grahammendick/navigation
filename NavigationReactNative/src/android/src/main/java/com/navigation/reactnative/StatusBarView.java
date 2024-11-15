package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.Window;
import android.view.WindowInsets;

import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.facebook.react.bridge.ReactContext;

public class StatusBarView extends ViewGroup {
    int barTintColor;
    final int defaultStatusBarColor;
    String tintStyle;
    boolean hidden;
    Boolean edgeToEdge = null;

    public StatusBarView(Context context) {
        super(context);
        TypedValue typedValue = new TypedValue();
        setLayoutParams(new CoordinatorLayout.LayoutParams(0, 0));
        context.getTheme().resolveAttribute(android.R.attr.colorPrimaryDark, typedValue, true);
        barTintColor = defaultStatusBarColor = typedValue.data;
        getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
                if (edgeToEdge == null) edgeToEdge = false;
                getViewTreeObserver().removeOnPreDrawListener(this);
                updateStatusBar();
                return true;
            }
        });
    }

    @Override
    public WindowInsets onApplyWindowInsets(WindowInsets insets) {
        edgeToEdge = true;
        return super.onApplyWindowInsets(insets);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        requestApplyInsets();
        updateStatusBar();
    }

    void onAfterUpdateTransaction() {
        updateStatusBar();
    }

    private void updateStatusBar() {
        Activity activity = ((ReactContext) getContext()).getCurrentActivity();
        Window window = activity != null ? activity.getWindow() : null;
        if (window == null || edgeToEdge == null) return;
        if (edgeToEdge) {
            WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, window.getDecorView());
            insetsController.setAppearanceLightStatusBars("dark".equals(tintStyle));
            if (hidden)
                insetsController.hide(WindowInsetsCompat.Type.statusBars());
            else
                insetsController.show(WindowInsetsCompat.Type.statusBars());
        } else {
            window.setStatusBarColor(barTintColor);
            int systemUiVisibilityFlags = getSystemUiVisibility();
            if ("dark".equals(tintStyle))
                systemUiVisibilityFlags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            else
                systemUiVisibilityFlags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            if (hidden)
                systemUiVisibilityFlags |= View.SYSTEM_UI_FLAG_FULLSCREEN;
            else
                systemUiVisibilityFlags &= ~View.SYSTEM_UI_FLAG_FULLSCREEN;
            setSystemUiVisibility(systemUiVisibilityFlags);
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
