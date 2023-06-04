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
    private boolean containerTransform = false;

    SharedElementMotion(SceneFragment enterScene, SceneFragment scene, HashSet<String> sharedElements, boolean containerTransform) {
        this.sharedElements = sharedElements;
        this.enterScene = enterScene;
        this.scene = scene;
        this.containerTransform = containerTransform;
    }

    void load(SharedElementView sharedElementView) {
        if (sharedElements.contains(sharedElementView.getTransitionName()) && !loadedSharedElements.contains(sharedElementView.getTransitionName())) {
            loadedSharedElements.add(sharedElementView.getTransitionName());
            if(sharedElements.size() == loadedSharedElements.size()) {
                Transition transition = sharedElementView.getTransition(containerTransform, enterScene == scene);
                // transition.addTarget(sharedElementView.getTransitionName());
                enterScene.setSharedElementEnterTransition(transition);
                enterScene.setSharedElementReturnTransition(transition);
                scene.startPostponedEnterTransition();
                scene.getScene().sharedElementMotion = null;
            }
        }
    }
}
