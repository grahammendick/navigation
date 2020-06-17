package com.navigation.reactnative;

import android.content.Context;
import android.os.Build;
import android.transition.Transition;
import android.transition.TransitionInflater;
import android.transition.TransitionSet;

import java.util.HashMap;
import java.util.HashSet;

class SharedElementTransitioner {
    private SharedElementContainer sharedElementContainer;
    private HashSet<String> sharedElements;
    private HashSet<String> loadedSharedElements = new HashSet<>();
    private HashMap<String, Transition> transitions = new HashMap<>();

    SharedElementTransitioner(SharedElementContainer sharedElementContainer, HashSet<String> sharedElements) {
        this.sharedElements = sharedElements;
        this.sharedElementContainer = sharedElementContainer;
    }

    void load(String sharedElement, String transitionKey, Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP)
            return;
        if (sharedElements.contains(sharedElement) && !loadedSharedElements.contains(sharedElement)) {
            loadedSharedElements.add(sharedElement);
            if (transitionKey == null)
                transitionKey = "move";
            Transition transition;
            if (transitions.containsKey(transitionKey))
                transition = transitions.get(transitionKey);
            else {
                String packageName = context.getPackageName();
                int transitionId = context.getResources().getIdentifier(transitionKey, "transition", packageName);
                if (transitionId == 0)
                    transitionId = context.getResources().getIdentifier("move", "transition", packageName);
                transition = TransitionInflater.from(context).inflateTransition(transitionId);
                transitions.put(transitionKey, transition);
            }
            transition.addTarget(sharedElement);
        }
        if(sharedElements.size() == loadedSharedElements.size()) {
            TransitionSet transitionSet = new TransitionSet();
            for(String key : transitions.keySet()) {
                transitionSet.addTransition(transitions.get(key));
            }
            sharedElementContainer.setEnterTransition(transitionSet);
            sharedElementContainer.setReturnTransition(transitionSet);
            sharedElementContainer.startPostponedEnterTransition();
            sharedElementContainer.getScene().transitioner = null;
        }
    }
}
