package com.navigation.reactnative;

import androidx.transition.Transition;
import androidx.transition.TransitionSet;

import com.google.android.material.transition.MaterialContainerTransform;

import java.util.HashSet;

class SharedElementTransitioner {
    private final SceneFragment sceneFragment;
    private final HashSet<String> sharedElements;
    private final HashSet<String> loadedSharedElements = new HashSet<>();
    private final HashSet<Transition> transitions = new HashSet<>();

    SharedElementTransitioner(SceneFragment sceneFragment, HashSet<String> sharedElements) {
        this.sharedElements = sharedElements;
        this.sceneFragment = sceneFragment;
    }

    void load(String sharedElement) {
        if (sharedElements.contains(sharedElement) && !loadedSharedElements.contains(sharedElement)) {
            loadedSharedElements.add(sharedElement);
            MaterialContainerTransform transition = new MaterialContainerTransform();
            transition.addTarget(sharedElement);
            transitions.add(transition);
        }
        if(sharedElements.size() == loadedSharedElements.size()) {
            TransitionSet transitionSet = new TransitionSet();
            for(Transition transition : transitions) {
                transitionSet.addTransition(transition);
            }
            sceneFragment.setSharedElementEnterTransition(transitionSet);
            sceneFragment.setSharedElementReturnTransition(transitionSet);
            sceneFragment.startPostponedEnterTransition();
            sceneFragment.getScene().transitioner = null;
        }
    }
}
