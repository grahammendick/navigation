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

    public void addView(View child, int index) {
        if (index == 0)
            super.addView(child, index);
        else {
            //store view against crumb somewhere
            //start activity passing the crumb
            scenes.put(index, child);
            Class scene = SceneActivity.class;
            Intent intent = new Intent(getContext(), scene);
            intent.putExtra(SceneActivity.CRUMB, index);
            //.put(nextCrumb, intent);
            ((ThemedReactContext) getContext()).startActivity(intent, null);
        }
    }
}
