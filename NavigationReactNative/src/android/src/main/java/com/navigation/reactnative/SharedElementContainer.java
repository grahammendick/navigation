package com.navigation.reactnative;

import android.transition.Transition;

import androidx.core.app.SharedElementCallback;

interface SharedElementContainer {
    SceneView getScene();

    void setEnterTransition(Transition transition);

    void setReturnTransition(Transition transition);

    void setExitCallback(SharedElementCallback sharedElementCallback);

    void setEnterCallback(SharedElementCallback sharedElementCallback);

    void startPostponedEnterTransition();
}
