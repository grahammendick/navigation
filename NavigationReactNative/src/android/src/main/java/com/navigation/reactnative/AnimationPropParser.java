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
        Pair<Integer, Float> fromX, toX, fromY, toY, pivotX, pivotY;
        String animType = anim != null ? anim.getString("type") : null;
        if (anim == null) return null;
        if (animType == null) {
            ReadableArray items = anim.hasKey("items") ? anim.getArray("items") : null;
            AnimationSet animationSet = new AnimationSet(true);
            if (anim.hasKey("duration")) animationSet.setDuration(anim.getInt("duration"));
            if (items != null) {
                for(int i = 0; i < items.size(); i++) {
                    animationSet.addAnimation(getAnimation(items.getMap(i), enter));
                }
            }
            return animationSet;
        };
        switch (animType) {
            case "translate":
                fromX = getValues(enter ? anim.getString("fromX") : null, 0);
                toX = getValues(!enter ? anim.getString("toX") : null, 0);
                fromY = getValues(enter ? anim.getString("fromY") : null, 0);
                toY = getValues(!enter ? anim.getString("toY") : null, 0);
                animation = new TranslateAnimation(fromX.first, fromX.second, toX.first, toX.second, fromY.first, fromY.second, toY.first, toY.second);
                animation.setDuration(anim.hasKey("duration") ? anim.getInt("duration") : 300);
                break;
            case "scale":
                fromX = getValues(enter ? anim.getString("fromX") : null);
                toX = getValues(!enter ? anim.getString("toX") : null);
                fromY = getValues(enter ? anim.getString("fromY") : null);
                toY = getValues(!enter ? anim.getString("toY") : null);
                pivotX = getValues(anim.getString("pivotX"),0.5f, Animation.RELATIVE_TO_SELF);
                pivotY = getValues(anim.getString("pivotY"),0.5f, Animation.RELATIVE_TO_SELF);
                animation = new ScaleAnimation(fromX.second, toX.second, fromY.second, toY.second, pivotX.first, pivotX.second, pivotY.first, pivotY.second);
                animation.setDuration(anim.hasKey("duration") ? anim.getInt("duration") : 300);
                break;
            case "alpha":
                float fromAlpha = enter && anim.hasKey("from") ? (float) anim.getDouble("from") : 1;
                float toAlpha = !enter && anim.hasKey("to") ? (float) anim.getDouble("to") : 1;
                animation = new AlphaAnimation(fromAlpha, toAlpha);
                animation.setDuration(anim.hasKey("duration") ? anim.getInt("duration") : 300);
                break;
            case "rotate":
                float fromDegrees = anim.hasKey("from") ? (float) anim.getDouble("from") : 0;
                float toDegrees = anim.hasKey("to") ? (float) anim.getDouble("to") : 0;
                pivotX = getValues(anim.getString("pivotX"),0.5f, Animation.RELATIVE_TO_SELF);
                pivotY = getValues(anim.getString("pivotY"),0.5f, Animation.RELATIVE_TO_SELF);
                animation = new RotateAnimation(fromDegrees, toDegrees, pivotX.first, pivotX.second, pivotY.first, pivotY.second);
                animation.setDuration(anim.hasKey("duration") ? anim.getInt("duration") : 300);
                break;
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
