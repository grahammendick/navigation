package com.navigation.reactnative;

import android.util.Pair;
import android.view.animation.Animation;

import androidx.transition.Transition;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.google.android.material.transition.Hold;
import com.google.android.material.transition.MaterialElevationScale;
import com.google.android.material.transition.MaterialFade;
import com.google.android.material.transition.MaterialFadeThrough;
import com.google.android.material.transition.MaterialSharedAxis;

import java.util.HashMap;
import java.util.Map;

public class AnimationPropParser {
    protected static Transition getTransition(ReadableMap trans) {
        Transition transition = null;
        if (trans == null) return null;
        ReadableArray items = trans.hasKey("items") ? trans.getArray("items") : null;
        if (items == null || items.size() == 0) return null;
        trans = items.getMap(0);
        String transType = trans.getString("type");
        if (transType == null) return null;
        switch (transType) {
            case "sharedAxis" -> {
                Map<String, Integer> axisMap = new HashMap<>();
                axisMap.put("x", MaterialSharedAxis.X);
                axisMap.put("y", MaterialSharedAxis.Y);
                Integer axis = axisMap.get(trans.getString("axis"));
                transition = new MaterialSharedAxis(axis != null ? axis : MaterialSharedAxis.Z, true);
            }
            case "elevationScale" -> transition = new MaterialElevationScale(true);
            case "fade" -> transition = new MaterialFade();
            case "fadeThrough" -> transition = new MaterialFadeThrough();
            case "hold" -> transition = new Hold();
        }
        return transition;
    }

    protected static Animation getAnimation(ReadableMap anim, boolean enter) {
        return null;
        /* Animation animation = null;
        Pair<Integer, Float> fromX, toX, fromY, toY, pivotX, pivotY;
        String animType = anim != null ? anim.getString("type") : null;
        if (anim == null) return null;
        if (animType == null) {
            ReadableArray items = anim.hasKey("items") ? anim.getArray("items") : null;
            AnimationSet animationSet = new AnimationSet(true);
            String duration = anim.getString("duration");
            if (duration != null) animationSet.setDuration(Integer.parseInt(duration));
            if (anim.hasKey("duration")) animationSet.setDuration(anim.getInt("duration"));
            if (items != null) {
                for(int i = 0; i < items.size(); i++) {
                    animation = getAnimation(items.getMap(i), enter);
                    if (animation != null) animationSet.addAnimation(animation);
                }
            }
            return animationSet.getAnimations().size() > 0 ? animationSet : null;
        };
        switch (animType) {
            case "translate":
                fromX = getValues(enter ? anim.getString("fromX") : null, 0);
                toX = getValues(!enter ? anim.getString("toX") : null, 0);
                fromY = getValues(enter ? anim.getString("fromY") : null, 0);
                toY = getValues(!enter ? anim.getString("toY") : null, 0);
                animation = new TranslateAnimation(fromX.first, fromX.second, toX.first, toX.second, fromY.first, fromY.second, toY.first, toY.second);
                break;
            case "scale":
                fromX = getValues(enter ? anim.getString("fromX") : null);
                toX = getValues(!enter ? anim.getString("toX") : null);
                fromY = getValues(enter ? anim.getString("fromY") : null);
                toY = getValues(!enter ? anim.getString("toY") : null);
                pivotX = getValues(anim.getString("pivotX"),0.5f, Animation.RELATIVE_TO_SELF);
                pivotY = getValues(anim.getString("pivotY"),0.5f, Animation.RELATIVE_TO_SELF);
                animation = new ScaleAnimation(fromX.second, toX.second, fromY.second, toY.second, pivotX.first, pivotX.second, pivotY.first, pivotY.second);
                break;
            case "alpha":
                float fromAlpha = getValues(enter ? anim.getString("from") : null).second;
                float toAlpha = getValues(!enter ? anim.getString("to") : null).second;
                animation = new AlphaAnimation(fromAlpha, toAlpha);
                break;
            case "rotate":
                float fromDegrees = getValues(anim.getString("from"), 0).second;
                float toDegrees = getValues(anim.getString("to"), 0).second;
                pivotX = getValues(anim.getString("pivotX"),0.5f, Animation.RELATIVE_TO_SELF);
                pivotY = getValues(anim.getString("pivotY"),0.5f, Animation.RELATIVE_TO_SELF);
                animation = new RotateAnimation(fromDegrees, toDegrees, pivotX.first, pivotX.second, pivotY.first, pivotY.second);
                break;
        }
        if (animation != null) {
            String duration = anim.getString("duration");
            animation.setDuration(duration != null ? Integer.parseInt(duration) : 300);
        }
        return animation; */
    }

    protected static Animator getAnimator(ReadableMap anim, boolean enter) {
        if (anim == null) return null;
        Animator animator = new Animator();
        ReadableArray items = anim.getArray("items");
        String duration = anim.getString("duration");
        if (duration != null) animator.duration = Integer.parseInt(duration);
        assert items != null;
        animator.items = new AnimatorItem[items.size()];
        for(int i = 0; i < items.size(); i++) {
            AnimatorItem animatorItem = new AnimatorItem();
            ReadableMap item = items.getMap(i);
            animatorItem.type = item.getString("type");
            String defaultVal = "0";
            if ("scale".equals(animatorItem.type) || "alpha".equals(animatorItem.type))
                defaultVal = "1";
            duration = item.getString("duration");
            if (duration != null) animatorItem.duration = Integer.parseInt(duration);
            animatorItem.x = parseAnimation(item.getString(enter ? "fromX" : "toX"), defaultVal);
            animatorItem.y = parseAnimation(item.getString(enter ? "fromY" : "toY"), defaultVal);
            if ("alpha".equals(animatorItem.type) || "rotate".equals(animatorItem.type))
                animatorItem.x = parseAnimation(item.getString(enter ? "from" : "to"), defaultVal);
            animator.items[i] = animatorItem;
        }
        return animator;
    }

    private static Pair<Float, Boolean> parseAnimation(String val, String defaultValue) {
        val = val != null && val.length() != 0 ? val : defaultValue;
        if (val.endsWith("%")) {
            return new Pair<>(Float.parseFloat(val.substring(0, val.length() - 1)), true);
        } else {
            return new Pair<>(Float.parseFloat(val), false);
        }
    }

    static class Animator {
        Integer duration;
        AnimatorItem[] items;
    }

    static class AnimatorItem {
        String type;
        Integer duration;
        Pair<Float, Boolean> x;
        Pair<Float, Boolean> y;
    }
}
