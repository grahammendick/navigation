package com.navigation.reactnative;

import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.uimanager.ThemedReactContext;

import java.util.ArrayList;

public class SceneBinView extends ViewGroup {
    private ArrayList<SceneView> scenes = new ArrayList<>();

    public SceneBinView(ThemedReactContext context) {
        super(context);
    }

    public ArrayList<SceneView> getScenes() {
        return scenes;
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    public int getChildCount() {
        return scenes.size();
    }

    @Override
    public View getChildAt(int index) {
        return scenes.get(index).getChildAt(0);
    }
}
