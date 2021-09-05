package com.navigation.reactnative;

import androidx.transition.Transition;
import androidx.transition.TransitionSet;

import com.google.android.material.transition.MaterialContainerTransform;

import java.util.HashSet;

class SharedElementTransitioner {
    private final SceneFragment enterScene;
    private final SceneFragment scene;
    private final HashSet<String> sharedElements;
    private final HashSet<String> loadedSharedElements = new HashSet<>();
    private final HashSet<Transition> transitions = new HashSet<>();

    SharedElementTransitioner(SceneFragment enterScene, SceneFragment scene, HashSet<String> sharedElements) {
        this.sharedElements = sharedElements;
        this.enterScene = enterScene;
        this.scene = scene;
    }

    void load(SharedElementView sharedElementView) {
        String sharedElement = sharedElementView.getTransitionName();
        if (sharedElements.contains(sharedElement) && !loadedSharedElements.contains(sharedElement)) {
            loadedSharedElements.add(sharedElement);
            MaterialContainerTransform transition = sharedElementView.transition;
            transition.setTransitionDirection(enterScene == scene ? MaterialContainerTransform.TRANSITION_DIRECTION_ENTER : MaterialContainerTransform.TRANSITION_DIRECTION_RETURN);
            transition.addTarget(sharedElement);
            transitions.add(transition);
        }
        if(sharedElements.size() == loadedSharedElements.size()) {
            TransitionSet transitionSet = new TransitionSet();
            for(Transition transition : transitions) {
                transitionSet.addTransition(transition);
            }
            enterScene.setSharedElementEnterTransition(transitionSet);
            enterScene.setSharedElementReturnTransition(transitionSet);
            scene.startPostponedEnterTransition();
            scene.getScene().transitioner = null;
        }
    }
}
