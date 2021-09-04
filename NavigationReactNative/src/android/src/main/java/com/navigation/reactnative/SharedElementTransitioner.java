package com.navigation.reactnative;

import android.content.Context;
import android.os.Build;
import androidx.transition.Transition;
import androidx.transition.TransitionSet;

import com.google.android.material.transition.MaterialContainerTransform;

import java.util.HashMap;
import java.util.HashSet;

class SharedElementTransitioner {
    private SceneFragment sceneFragment;
    private HashSet<String> sharedElements;
    private HashSet<String> loadedSharedElements = new HashSet<>();
    private HashMap<String, Transition> transitions = new HashMap<>();

    SharedElementTransitioner(SceneFragment sceneFragment, HashSet<String> sharedElements) {
        this.sharedElements = sharedElements;
        this.sceneFragment = sceneFragment;
    }

    void load(String sharedElement, String transitionKey, Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP)
            return;
        if (sharedElements.contains(sharedElement) && !loadedSharedElements.contains(sharedElement)) {
            loadedSharedElements.add(sharedElement);
            MaterialContainerTransform transition = new MaterialContainerTransform();
            transition.addTarget(sharedElement);
            transitions.put(transitionKey, transition);
        }
        if(sharedElements.size() == loadedSharedElements.size()) {
            TransitionSet transitionSet = new TransitionSet();
            for(String key : transitions.keySet()) {
                transitionSet.addTransition(transitions.get(key));
            }
            sceneFragment.setSharedElementEnterTransition(transitionSet);
            sceneFragment.setSharedElementReturnTransition(transitionSet);
            sceneFragment.startPostponedEnterTransition();
            sceneFragment.getScene().transitioner = null;
        }
    }
}
