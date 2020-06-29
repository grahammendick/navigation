package com.navigation.reactnative;

import android.os.Bundle;
import android.transition.Transition;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.SharedElementCallback;
import androidx.fragment.app.Fragment;

import java.util.HashSet;

public class SceneFragment extends Fragment implements SharedElementContainer {
    private SceneView scene;

    public SceneFragment() {
        super();
    }

    SceneFragment(SceneView scene, HashSet<String> sharedElements) {
        super();
        this.scene = scene;
        scene.fragmentMode = true;
        if (sharedElements != null )
            scene.transitioner = new SharedElementTransitioner(this, sharedElements);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        if (scene != null) {
            if (scene.getParent() != null)
                ((ViewGroup) scene.getParent()).endViewTransition(scene);
            if (scene.transitioner != null)
                postponeEnterTransition();
            return scene;
        }
        return new View(getContext());
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (scene != null)
            scene.popped();
    }

    @Override
    public SceneView getScene() {
        return scene;
    }

    @Override
    public void setEnterTransition(Transition transition) {
        setSharedElementEnterTransition(transition);
    }

    @Override
    public void setReturnTransition(Transition transition) {
        setSharedElementReturnTransition(transition);
    }

    @Override
    public void setExitCallback(SharedElementCallback sharedElementCallback) {
        setExitSharedElementCallback(sharedElementCallback);
    }

    @Override
    public void setEnterCallback(SharedElementCallback sharedElementCallback) {
        setEnterSharedElementCallback(sharedElementCallback);
    }
}
