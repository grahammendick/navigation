package com.navigation.reactnative;

import android.util.Pair;
import android.view.animation.Animation;
import android.view.animation.ScaleAnimation;
import android.view.animation.TranslateAnimation;

import androidx.transition.Transition;

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
        String transType = trans != null ? trans.getString("type") : null;
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
        Pair<Integer, Float> fromX, toX, fromY, toY;
        String animType = anim != null ? anim.getString("type") : null;
        if (animType == null) return null;
        switch (animType) {
            case "translate":
                fromX = getTranslateValues(enter ? anim.getString("fromX") : null, 0, Animation.ABSOLUTE);
                toX = getTranslateValues(!enter ? anim.getString("toX") : null, 0, Animation.ABSOLUTE);
                fromY = getTranslateValues(enter ? anim.getString("fromY") : null, 0, Animation.ABSOLUTE);
                toY = getTranslateValues(!enter ? anim.getString("toY") : null, 0, Animation.ABSOLUTE);
                animation = new TranslateAnimation(fromX.first, fromX.second, toX.first, toX.second, fromY.first, fromY.second, toY.first, toY.second);
                animation.setDuration(anim.hasKey("duration") ? anim.getInt("duration") : 300);
                break;
            case "scale":
                fromX = getTranslateValues(enter ? anim.getString("fromX") : null, 1, Animation.ABSOLUTE);
                toX = getTranslateValues(!enter ? anim.getString("toX") : null, 1, Animation.ABSOLUTE);
                fromY = getTranslateValues(enter ? anim.getString("fromY") : null, 1, Animation.ABSOLUTE);
                toY = getTranslateValues(!enter ? anim.getString("toY") : null, 1, Animation.ABSOLUTE);
                Pair<Integer, Float> pivotX = getTranslateValues(anim.getString("pivotX"),0.5f, Animation.RELATIVE_TO_SELF);
                Pair<Integer, Float> pivotY = getTranslateValues(anim.getString("pivotY"),0.5f, Animation.RELATIVE_TO_SELF);
                animation = new ScaleAnimation(fromX.second, toX.second, fromY.second, toY.second, pivotX.first, pivotX.second, pivotY.first, pivotY.second);
                animation.setDuration(anim.hasKey("duration") ? anim.getInt("duration") : 300);
                break;
        }
        return animation;
    }

    private static Pair<Integer, Float> getTranslateValues(String from, float defaultFromValue, int defaultFromType) {
        float fromValue = defaultFromValue;
        int fromType = defaultFromType;
        if (from != null) {
            if (from.endsWith("%")) {
                fromType = Animation.RELATIVE_TO_SELF;
                fromValue = Float.parseFloat(from.substring(0, from.length() - 1)) / 100;
            } else {
                fromValue = Float.parseFloat(from);
            }
        }
        return new Pair<>(fromType, fromValue);
    }
}
