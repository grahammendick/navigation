package com.navigation.reactnative;

import android.content.Context;
import android.widget.FrameLayout;

public class SharedElementView extends FrameLayout {
    protected String name;
    protected int crumb;
    protected String enterTransition;
    protected String exitTransition;

    public SharedElementView(Context context) {
        super(context);
    }
}
