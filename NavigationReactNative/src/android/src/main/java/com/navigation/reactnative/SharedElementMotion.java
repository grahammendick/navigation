package com.navigation.reactnative;

import com.google.android.material.transition.MaterialContainerTransform;

class SharedElementMotion {
    private final SceneFragment enterScene;
    private final SceneFragment scene;
    private final String sharedElementName;

    SharedElementMotion(SceneFragment enterScene, SceneFragment scene, String sharedElementName) {
        this.sharedElementName = sharedElementName;
        this.enterScene = enterScene;
        this.scene = scene;
    }

    void load(SharedElementView sharedElementView) {
        String sharedElement = sharedElementView.getTransitionName();
        if (sharedElementName.equals(sharedElement)) {
            MaterialContainerTransform transition = sharedElementView.transition;
            transition.setTransitionDirection(enterScene == scene ? MaterialContainerTransform.TRANSITION_DIRECTION_ENTER : MaterialContainerTransform.TRANSITION_DIRECTION_RETURN);
            transition.addTarget(sharedElement);
            enterScene.setSharedElementEnterTransition(transition);
            enterScene.setSharedElementReturnTransition(transition);
            scene.startPostponedEnterTransition();
            scene.getScene().sharedElementMotion = null;
        }
    }
}
