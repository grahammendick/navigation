package com.navigation.reactnative;

import android.app.Activity;

import java.util.HashSet;

public class SharedElementTransitioner {
    private Activity activity;
    private HashSet<String> sharedElements;

    public SharedElementTransitioner(Activity activity, HashSet<String> sharedElements) {
        this.activity = activity;
        this.sharedElements = sharedElements;
    }
}
