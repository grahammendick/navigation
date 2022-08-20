package com.navigation.reactnative;

import androidx.annotation.NonNull;
import androidx.appcompat.view.ContextThemeWrapper;

import com.facebook.react.bridge.ReactApplicationContext;
import com.google.android.material.color.MaterialColors;

import java.util.HashMap;
import java.util.Map;

public class Material3Module extends NativeMaterial3ModuleSpec {
    Material3Module(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "Material3";
    }

    @Override
    public Map<String, Object> getTypedExportedConstants() {
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
