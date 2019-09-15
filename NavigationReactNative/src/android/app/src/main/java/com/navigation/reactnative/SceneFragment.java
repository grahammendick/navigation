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

public class SceneFragment extends Fragment implements SharedElementContainer {
    public SceneView scene;

    public SceneFragment(SceneView scene) {
        super();
        this.scene = scene;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return scene;
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
    public void setExitCallback(SharedElementCallback sharedElementCallback) {
        setExitSharedElementCallback(sharedElementCallback);
    }
}
