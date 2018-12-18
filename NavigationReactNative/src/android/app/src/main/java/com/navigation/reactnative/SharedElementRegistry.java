package com.navigation.reactnative;

import android.annotation.SuppressLint;
import android.util.Pair;
import android.view.View;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.HashSet;

public class SharedElementRegistry {
    private static final HashMap<Integer, HashSet<WeakReference<View>>> sharedElements;

    static {
        sharedElements = new HashMap<Integer, HashSet<WeakReference<View>>>();
    }

    public static void registerSharedElement(int scene, View view) {
        if (!sharedElements.containsKey(scene) || !sharedElements.get(scene).contains(view)) {
            synchronized (SharedElementRegistry.class) {
                if (!sharedElements.containsKey(scene)) {
                    sharedElements.put(scene, new HashSet<WeakReference<View>>());
                }
                sharedElements.get(scene).add(new WeakReference(view));
            }
        }
    }

    @SuppressLint("NewApi")
    public static Pair[] getSharedElements(int scene) {
        Pair[] sharedEls = new Pair[sharedElements.get(scene).size()];
        int size = 0;
        for(WeakReference<View> sharedElement : sharedElements.get(scene)) {
            Pair sharedEl = Pair.create(sharedElement.get(), sharedElement.get().getTransitionName());
            sharedEls[size] = sharedEl;
            size++;
        }
        return sharedEls;
    }
}
