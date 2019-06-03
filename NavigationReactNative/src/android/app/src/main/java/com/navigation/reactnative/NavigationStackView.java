package com.navigation.reactnative;

import android.content.Intent;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.uimanager.ThemedReactContext;

import java.util.ArrayList;

public class NavigationStackView extends ViewGroup {
    static class SceneItem {
        public int crumb;
        public Intent intent;
        public View view;
        public SceneItem(int crumb, Intent intent, View view){
            this.crumb = crumb;
            this.intent = intent;
            this.view = view;
        }
    }
    public static ArrayList<SceneItem> scenes = new ArrayList<>();


    public NavigationStackView(ThemedReactContext context) {
        super(context);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    @Override
    public void addView(View child, int index) {
        Intent intent;
        if (index == 0) {
            if (scenes.size() > 0) {
                intent = scenes.get(0).intent;
                ((ThemedReactContext) getContext()).getCurrentActivity().navigateUpTo(intent);
                scenes.clear();
            }
            super.addView(child, index);
            intent = ((ThemedReactContext) getContext()).getCurrentActivity().getIntent();
        }
        else {
            Class scene = index % 2 == 1 ? SceneActivity.class : AlternateSceneActivity.class;
            intent = new Intent(getContext(), scene);
            intent.putExtra(SceneActivity.CRUMB, index);
            ((ThemedReactContext) getContext()).getCurrentActivity().startActivity(intent, null);
        }
        scenes.add(index, new SceneItem(index, intent, child));
    }

    @Override
    public void removeViewAt(int index) {
        SceneItem item = scenes.remove(index);
        if (item.crumb == index) {
            Intent intent = scenes.get(index - 1).intent;
            ((ThemedReactContext) getContext()).getCurrentActivity().navigateUpTo(intent);
        }
    }

    @Override
    public int getChildCount() {
        return scenes.size();
    }

    @Override
    public View getChildAt(int index) {
        return scenes.get(index).view;
    }
}