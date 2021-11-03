package com.navigation.reactnative;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class SceneFragment extends Fragment {
    private SceneView scene;

    public SceneFragment() {
        super();
    }

    SceneFragment(SceneView scene, String sharedElement) {
        super();
        this.scene = scene;
        if (sharedElement != null )
            scene.sharedElementMotion = new SharedElementMotion(this, this, sharedElement);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        if (scene != null) {
            if (scene.getParent() != null)
                ((ViewGroup) scene.getParent()).endViewTransition(scene);
            if (scene.sharedElementMotion != null)
                postponeEnterTransition();
            return scene;
        }
        return new View(getContext());
    }

    @Nullable
    @Override
    public Animation onCreateAnimation(int transit, boolean enter, int nextAnim) {
        if (nextAnim != 0 && enter) {
            Animation anim = AnimationUtils.loadAnimation(getContext(), nextAnim);
            anim.setAnimationListener(new Animation.AnimationListener() {
                @Override
                public void onAnimationStart(Animation animation) {
                }

                @Override
                public void onAnimationEnd(Animation animation) {
                    ((NavigationStackView) scene.getParent()).onRest(scene.crumb);
                }

                @Override
                public void onAnimationRepeat(Animation animation) {
                }
            });
            return anim;
        }
        // Handle enter and nextAnim 0
        return super.onCreateAnimation(transit, enter, nextAnim);
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
