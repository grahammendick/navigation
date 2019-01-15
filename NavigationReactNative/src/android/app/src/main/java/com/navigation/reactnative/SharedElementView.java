package com.navigation.reactnative;

import android.content.Context;
import android.widget.FrameLayout;

public class SharedElementView extends FrameLayout {
    private String name;
    private String enterTransition;
    private String exitTransition;

    public SharedElementView(Context context) {
        super(context);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEnterTransition() {
        return enterTransition;
    }

    public void setEnterTransition(String enterTransition) {
        this.enterTransition = enterTransition;
    }

    public String getExitTransition() {
        return exitTransition;
    }

    public void setExitTransition(String exitTransition) {
        this.exitTransition = exitTransition;
    }
}
