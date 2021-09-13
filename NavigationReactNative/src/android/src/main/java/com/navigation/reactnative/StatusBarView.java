package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup;

import androidx.core.view.ViewCompat;

import com.facebook.react.bridge.ReactContext;

public class StatusBarView extends ViewGroup {
    int barTintColor;
    final int defaultStatusBarColor;
    String tintStyle;
    boolean hidden;

    public StatusBarView(Context context) {
        super(context);
        TypedValue typedValue = new TypedValue();
        context.getTheme().resolveAttribute(R.attr.colorPrimaryDark, typedValue, true);
        barTintColor = defaultStatusBarColor = typedValue.data;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        updateStatusBar();
    }

    void onAfterUpdateTransaction() {
        if (ViewCompat.isAttachedToWindow(this))
            updateStatusBar();
    }

    private void updateStatusBar() {
        Activity activity = ((ReactContext) getContext()).getCurrentActivity();
        if (activity != null)
            activity.getWindow().setStatusBarColor(barTintColor);
        int systemUiVisibilityFlags = getSystemUiVisibility();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if ("dark".equals(tintStyle))
                systemUiVisibilityFlags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            else
                systemUiVisibilityFlags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        }
        if (hidden)
            systemUiVisibilityFlags |= View.SYSTEM_UI_FLAG_FULLSCREEN;
        else
            systemUiVisibilityFlags &= ~View.SYSTEM_UI_FLAG_FULLSCREEN;
        setSystemUiVisibility(systemUiVisibilityFlags);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
