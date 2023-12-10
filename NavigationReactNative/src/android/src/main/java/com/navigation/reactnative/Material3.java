package com.navigation.reactnative;

import androidx.annotation.NonNull;
import androidx.appcompat.view.ContextThemeWrapper;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.google.android.material.color.MaterialColors;
import com.google.android.material.R;

import java.util.HashMap;
import java.util.Map;

public class Material3 extends ReactContextBaseJavaModule {
    Material3(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "Material3";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        int theme = getReactApplicationContext().getApplicationInfo().theme;
        ContextThemeWrapper context = new ContextThemeWrapper(getReactApplicationContext(), theme);
        try {
            MaterialColors.getColor(context, R.attr.colorTertiary, "");
            constants.put("on", true);
        } catch(IllegalArgumentException ex) {
            constants.put("on", false);
        }
        return constants;
    }
}
