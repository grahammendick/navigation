package com.navigation.reactnative;

import android.content.Intent;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.uimanager.ThemedReactContext;

import java.util.HashMap;

public class NavigationStackView extends ViewGroup {
    public static HashMap<Integer, View> scenes = new HashMap<>();


    public NavigationStackView(ThemedReactContext context) {
        super(context);
    }

    @Override
    protected void onLayout(boolean b, int i, int i1, int i2, int i3) {
    }

    @Override
    public void addView(View child, int index) {
        scenes.put(index, child);
        if (index == 0) {
            super.addView(child, index);
        }
        else {
            Class scene = SceneActivity.class;
            Intent intent = new Intent(getContext(), scene);
            intent.putExtra(SceneActivity.CRUMB, index);
            getContext().startActivity(intent, null);
        }
    }

    @Override
    public void removeViewAt(int index) {
        scenes.remove(index);
        ((ThemedReactContext) getContext()).getCurrentActivity().finish();
    }

    @Override
    public int getChildCount() {
        return scenes.size();
    }

    public View getChildAt(int index) {
        return scenes.get(index);
    }
}