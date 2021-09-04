package com.navigation.reactnative;

import androidx.transition.Transition;
import androidx.transition.TransitionSet;

import com.google.android.material.transition.MaterialContainerTransform;

import java.util.HashSet;

class SharedElementTransitioner {
    private final SceneFragment transitionScene;
    private final SceneFragment postponedScene;
    private final HashSet<String> sharedElements;
    private final HashSet<String> loadedSharedElements = new HashSet<>();
    private final HashSet<Transition> transitions = new HashSet<>();

    SharedElementTransitioner(SceneFragment transitionScene, SceneFragment postponedScene, HashSet<String> sharedElements) {
        this.sharedElements = sharedElements;
        this.transitionScene = transitionScene;
        this.postponedScene = postponedScene;
    }

    void load(SharedElementView sharedElementView) {
        String sharedElement = sharedElementView.getTransitionName();
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
            transitionScene.setSharedElementEnterTransition(transitionSet);
            transitionScene.setSharedElementReturnTransition(transitionSet);
            postponedScene.startPostponedEnterTransition();
            postponedScene.getScene().transitioner = null;
        }
    }
}
