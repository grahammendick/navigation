package com.navigation.reactnative;

import android.util.Pair;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.view.animation.RotateAnimation;
import android.view.animation.ScaleAnimation;
import android.view.animation.TranslateAnimation;

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
            case "sharedAxis":
                Map<String, Integer> axisMap = new HashMap<>();
                axisMap.put("x", MaterialSharedAxis.X);
                axisMap.put("y", MaterialSharedAxis.Y);
                Integer axis = axisMap.get(trans.getString("axis"));
                transition = new MaterialSharedAxis(axis != null ? axis : MaterialSharedAxis.Z, true);
                break;
            case "elevationScale":
                transition = new MaterialElevationScale(true);
                break;
            case "fade":
                transition = new MaterialFade();
                break;
            case "fadeThrough":
                transition = new MaterialFadeThrough();
                break;
            case "hold":
                transition = new Hold();
                break;
        }
        return transition;
    }

    protected static Animation getAnimation(ReadableMap anim, boolean enter) {
        Animation animation = null;
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
        return animation;
    }

    private static Pair<Integer, Float> getValues(String from) {
        return getValues(from, 1);
    }

    private static Pair<Integer, Float> getValues(String from, float defaultFromValue) {
        return getValues(from, defaultFromValue, Animation.ABSOLUTE);
    }

    private static Pair<Integer, Float> getValues(String from, float defaultFromValue, int defaultFromType) {
        float fromValue = defaultFromValue;
        int fromType = defaultFromType;
        if (from != null) {
            if (from.endsWith("%")) {
                fromType = Animation.RELATIVE_TO_SELF;
                fromValue = Float.parseFloat(from.substring(0, from.length() - 1)) / 100;
            } else {
                fromType = Animation.ABSOLUTE;
                fromValue = Float.parseFloat(from);
            }
        }
        return new Pair<>(fromType, fromValue);
    }
}
