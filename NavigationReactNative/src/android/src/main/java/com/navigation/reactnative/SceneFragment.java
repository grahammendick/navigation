package com.navigation.reactnative;

import android.animation.Animator;
import android.animation.AnimatorInflater;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
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
    protected AnimationPropParser.Animator enterAnimator;
    protected AnimationPropParser.Animator returnAnimator;
    protected AnimationPropParser.Animator exitAnimator;
    protected AnimationPropParser.Animator reenterAnimator;
    protected boolean predictiveSharedElements = false;

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
            Animation anim;
            try {
                anim = AnimationUtils.loadAnimation(getContext(), nextAnim);
            } catch(RuntimeException e) {
                return null;
            }
            anim.setAnimationListener(new Animation.AnimationListener() {
                @Override
                public void onAnimationStart(Animation animation) {
                }

                @Override
                public void onAnimationEnd(Animation animation) {
                    if (scene.getParent() instanceof NavigationStackView)
                        ((NavigationStackView) scene.getParent()).onRest(scene.crumb);
                }

                @Override
                public void onAnimationRepeat(Animation animation) {
                }
            });
            return anim;
        }
        return super.onCreateAnimation(transit, enter, nextAnim);
    }

    @Nullable
    @Override
    public Animator onCreateAnimator(int transit, boolean enter, int nextAnim) {
        if ((nextAnim != 0 || enterAnimator != null) && enter) {
            Animator anim;
            try {
                anim = nextAnim == 0 ? transform(enterAnimator, true) : (nextAnim == -1 ? transform(reenterAnimator, true) : AnimatorInflater.loadAnimator(getContext(), nextAnim));
            } catch(RuntimeException e) {
                return null;
            }
            assert anim != null;
            anim.addListener(new Animator.AnimatorListener() {
                @Override
                public void onAnimationStart(@NonNull Animator animator) {
                }

                @Override
                public void onAnimationEnd(@NonNull Animator animator) {
                    if (scene.getParent() instanceof NavigationStackView)
                        ((NavigationStackView) scene.getParent()).onRest(scene.crumb);
                }

                @Override
                public void onAnimationCancel(@NonNull Animator animator) {
                }

                @Override
                public void onAnimationRepeat(@NonNull Animator animator) {
                }
            });
            return anim;
        }
        if (!predictiveSharedElements && (nextAnim == 0 && enterAnimator == null) && enter && getLifecycle().getCurrentState().isAtLeast(Lifecycle.State.STARTED)) {
            ((NavigationStackView) scene.getParent()).onRest(scene.crumb);
        }
        predictiveSharedElements = false;
        if (nextAnim == 0 && exitAnimator != null && !enter) return transform(exitAnimator, false);
        if (nextAnim == -1 && returnAnimator != null) return transform(returnAnimator, false);
        return super.onCreateAnimator(transit, enter, nextAnim);
    }

    private Animator transform(AnimationPropParser.Animator anim, boolean from) {
        AnimatorSet animatorSet = new AnimatorSet();
        if (anim.duration != null)
            animatorSet.setDuration(anim.duration);
        for (int i = 0; i < anim.items.length; i++) {
            AnimationPropParser.AnimatorItem item = anim.items[i];
            if ("translate".equals(item.type)) {
                ObjectAnimator xAnimator = new ObjectAnimator();
                xAnimator.setPropertyName("translationX");
                float xVal = item.x.second ? scene.getWidth() * item.x.first / 100 : item.x.first;
                xAnimator.setFloatValues(from ? xVal : 0, from ? 0 : xVal);
                xAnimator.setDuration(item.duration != null ? item.duration : 300);
                ObjectAnimator yAnimator = new ObjectAnimator();
                yAnimator.setPropertyName("translationY");
                float yVal = item.y.second ? scene.getHeight() * item.y.first / 100 : item.y.first;
                yAnimator.setFloatValues(from ? yVal : 0, from ? 0 : yVal);
                yAnimator.setDuration(item.duration != null ? item.duration : 300);
                animatorSet.playTogether(xAnimator, yAnimator);
            }
            if ("scale".equals(item.type)) {
                ObjectAnimator xAnimator = new ObjectAnimator();
                xAnimator.setPropertyName("scaleX");
                float xVal = item.x.second ? item.x.first / 100 : item.x.first;
                xAnimator.setFloatValues(from ? xVal : 1, from ? 1 : xVal);
                xAnimator.setDuration(item.duration != null ? item.duration : 300);
                ObjectAnimator yAnimator = new ObjectAnimator();
                yAnimator.setPropertyName("scaleY");
                float yVal = item.y.second ? item.y.first / 100 : item.y.first;
                yAnimator.setFloatValues(from ? yVal : 1, from ? 1 : yVal);
                yAnimator.setDuration(item.duration != null ? item.duration : 300);
                animatorSet.playTogether(xAnimator, yAnimator);
            }
            if ("alpha".equals(item.type)) {
                ObjectAnimator alphaAnimator = new ObjectAnimator();
                alphaAnimator.setPropertyName("alpha");
                alphaAnimator.setFloatValues(from ? item.x.first : 1, from ? 1 : item.x.first);
                alphaAnimator.setDuration(item.duration != null ? item.duration : 300);
                animatorSet.playTogether(alphaAnimator);
            }
            if ("rotate".equals(item.type)) {
                ObjectAnimator rotateAnimator = new ObjectAnimator();
                rotateAnimator.setPropertyName("rotation");
                rotateAnimator.setFloatValues(from ? item.x.first : 0, from ? 0 : item.x.first);
                rotateAnimator.setDuration(item.duration != null ? item.duration : 300);
                animatorSet.playTogether(rotateAnimator);
            }
        }
        return animatorSet;
    }

    @Override
    public void setEnterTransition(@Nullable Object transition) {
        super.setEnterTransition(transition);
        if (transition == null) return;
        ((Transition) transition).addListener(new TransitionListenerAdapter(){
            @Override
            public void onTransitionEnd(@NonNull Transition transition) {
                super.onTransitionEnd(transition);
                if (scene.getParent() instanceof NavigationStackView && isVisible())
                    ((NavigationStackView) scene.getParent()).onRest(scene.crumb);
            }
        });
    }

    @Override
    public void setReenterTransition(@Nullable Object transition) {
        super.setReenterTransition(transition);
        if (transition == null) return;
        ((Transition) transition).addListener(new TransitionListenerAdapter(){
            @Override
            public void onTransitionEnd(@NonNull Transition transition) {
                super.onTransitionEnd(transition);
                if (scene.getParent() instanceof NavigationStackView && isVisible())
                    ((NavigationStackView) scene.getParent()).onRest(scene.crumb);
            }
        });
    }

    @Override
    public void setReturnTransition(@Nullable Object transition) {
        super.setReturnTransition(transition);
        if (transition == null) return;
        ((Transition) transition).addListener(new TransitionListenerAdapter(){
            @Override
            public void onTransitionEnd(@NonNull Transition transition) {
                super.onTransitionEnd(transition);
                if (scene != null && !isVisible())
                  scene.popped();
            }
        });
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (getReturnTransition() == null && scene != null)
            scene.popped();
    }

    public SceneView getScene() {
        return scene;
    }
}
