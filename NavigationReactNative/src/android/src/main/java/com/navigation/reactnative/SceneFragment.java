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
import androidx.lifecycle.Lifecycle;
import androidx.transition.Transition;
import androidx.transition.TransitionListenerAdapter;

import java.util.HashSet;
import java.util.concurrent.TimeUnit;

public class SceneFragment extends Fragment {
    private SceneView scene;
    private boolean destroyed = false;

    public SceneFragment() {
        super();
    }

    SceneFragment(SceneView scene, HashSet<String> sharedElements, boolean containerTransform) {
        super();
        this.scene = scene;
        if (sharedElements != null )
            scene.sharedElementMotion = new SharedElementMotion(this, this, sharedElements, containerTransform);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        if (scene != null) {
            if (scene.getParent() != null)
                ((ViewGroup) scene.getParent()).endViewTransition(scene);
            if (scene.sharedElementMotion != null)
                postponeEnterTransition(300, TimeUnit.MILLISECONDS);
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
        if (nextAnim == 0 && enter && getLifecycle().getCurrentState().isAtLeast(Lifecycle.State.STARTED)) {
            ((NavigationStackView) scene.getParent()).onRest(scene.crumb);
        }
        return super.onCreateAnimation(transit, enter, nextAnim);
    }

    @Override
    public void setEnterTransition(@Nullable Object transition) {
        super.setEnterTransition(transition);
        ((Transition) transition).addListener(new TransitionListenerAdapter() {
            @Override
            public void onTransitionEnd(@NonNull Transition transition) {
                super.onTransitionEnd(transition);
                ((ViewGroup) scene.getParent()).endViewTransition(scene);
                if (destroyed) scene.popped();
            }
        });
    }

    @Override
    public void setExitTransition(@Nullable Object transition) {
        super.setExitTransition(transition);
        ((Transition) transition).addListener(new TransitionListenerAdapter() {
            @Override
            public void onTransitionEnd(@NonNull Transition transition) {
                super.onTransitionEnd(transition);
                ((ViewGroup) scene.getParent()).endViewTransition(scene);
            }
        });
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        destroyed = true;
        if (scene != null && getEnterTransition() == null)
            scene.popped();
    }

    public SceneView getScene() {
        return scene;
    }
}
