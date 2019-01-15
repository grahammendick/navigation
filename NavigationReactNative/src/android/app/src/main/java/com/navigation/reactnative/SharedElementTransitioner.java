package com.navigation.reactnative;

import android.app.Activity;
import android.transition.Transition;
import android.transition.TransitionInflater;
import android.view.View;

import java.util.HashSet;

public class SharedElementTransitioner {
    private Activity activity;
    private HashSet<String> sharedElements;
    private HashSet<String> loadedSharedElements;

    public SharedElementTransitioner(Activity activity, HashSet<String> sharedElements) {
        this.activity = activity;
        this.sharedElements = sharedElements;
        this.loadedSharedElements = new HashSet<>();
    }

    public void load(String sharedElement) {
        if (sharedElements.contains(sharedElement) && !loadedSharedElements.contains(sharedElement)) {
            loadedSharedElements.add(sharedElement);
        }
        if(sharedElements.size() == loadedSharedElements.size()) {
            Transition transition = TransitionInflater.from(activity).inflateTransition(R.transition.move);
            activity.getWindow().setSharedElementEnterTransition(transition);
            activity.startPostponedEnterTransition();
            View contentView = activity.findViewById(android.R.id.content);
            contentView.getRootView().setTag(R.id.sharedElementTransitioner, null);
        }
    }
}
