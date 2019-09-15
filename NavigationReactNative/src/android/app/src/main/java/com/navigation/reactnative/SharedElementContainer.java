package com.navigation.reactnative;

import android.transition.Transition;

import androidx.core.app.SharedElementCallback;

interface SharedElementContainer {
    SceneView getScene();

    void setEnterTransition(Transition transition);

    void setExitCallback(SharedElementCallback sharedElementCallback);

    void startPostponedEnterTransition();
}
