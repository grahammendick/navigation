package com.navigation.reactnative;

import android.util.Pair;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

public class AnimationPropParser {
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
        val = val != null && !val.isEmpty() ? val : defaultValue;
        if (val.endsWith("%")) {
            return new Pair<>(Float.parseFloat(val.substring(0, val.length() - 1)), true);
        } else {
            return new Pair<>(Float.parseFloat(val), false);
        }
    }

    public static class Animator {
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
