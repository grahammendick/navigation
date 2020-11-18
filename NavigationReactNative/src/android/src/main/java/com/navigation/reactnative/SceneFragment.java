package com.navigation.reactnative;

import android.os.Build;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import java.util.HashSet;

public class SceneFragment extends Fragment {
    private SceneView scene;
    private int defaultStatusBarColor;

    public SceneFragment() {
        super();
    }

    SceneFragment(SceneView scene, HashSet<String> sharedElements) {
        super();
        TypedValue typedValue = new TypedValue();
        scene.getContext().getTheme().resolveAttribute(R.attr.colorPrimaryDark, typedValue, true);
        defaultStatusBarColor = typedValue.data;
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
    public void onStart() {
        super.onStart();
        if (getActivity() != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            if (!scene.statusBar)
                getActivity().getWindow().setStatusBarColor(defaultStatusBarColor);
            scene.statusBar = false;
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (scene != null)
            scene.popped();
    }

    public SceneView getScene() {
        return scene;
    }
}
