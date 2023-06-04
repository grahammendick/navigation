package com.navigation.reactnative;

import android.graphics.Color;

import androidx.transition.Transition;

import com.google.android.material.transition.MaterialContainerTransform;

import java.util.HashSet;

class SharedElementMotion {
    private final SceneFragment enterScene;
    private final SceneFragment scene;
    private HashSet<String> sharedElements;
    private HashSet<String> loadedSharedElements = new HashSet<>();

    SharedElementMotion(SceneFragment enterScene, SceneFragment scene, HashSet<String> sharedElements) {
        this.sharedElements = sharedElements;
        this.enterScene = enterScene;
        this.scene = scene;
    }

    void load(SharedElementView sharedElementView) {
        if (sharedElements.contains(sharedElementView.name) && !loadedSharedElements.contains(sharedElementView.name)) {
            loadedSharedElements.add(sharedElementView.name);
            Transition transition = sharedElementView.transition;
            // transition.setTransitionDirection(enterScene == scene ? MaterialContainerTransform.TRANSITION_DIRECTION_ENTER : MaterialContainerTransform.TRANSITION_DIRECTION_RETURN);
            transition.addTarget(sharedElementView.name);
            // transition.setScrimColor(Color.TRANSPARENT);
            if(sharedElements.size() == loadedSharedElements.size()) {
                enterScene.setSharedElementEnterTransition(transition);
                enterScene.setSharedElementReturnTransition(transition);
                scene.startPostponedEnterTransition();
                scene.getScene().sharedElementMotion = null;
            }
        }
    }
}
