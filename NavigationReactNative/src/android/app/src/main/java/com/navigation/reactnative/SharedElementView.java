package com.navigation.reactnative;

import android.content.Context;
import android.widget.FrameLayout;

public class SharedElementView extends FrameLayout {
    private String name;

    public SharedElementView(Context context) {
        super(context);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
