package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.text.SpannableString;
import android.text.style.AbsoluteSizeSpan;
import android.text.style.StyleSpan;
import android.text.style.TypefaceSpan;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.text.ReactTypefaceUtils;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;

public class ExtendedFloatingActionButtonView extends ExtendedFloatingActionButton {
    final int defaultBackgroundColor;
    final int defaultColor;
    final CoordinatorLayout.LayoutParams params;
    int marginTop, marginRight, marginBottom, marginLeft, marginStart, marginEnd, margin;
    private String text;
    private String fontFamily;
    private String fontWeight;
    private String fontStyle;
    private Integer fontSize;
    private boolean textChanged = false;
    private final IconResolver.IconResolverListener iconResolverListener;

    public ExtendedFloatingActionButtonView(@NonNull Context context) {
        super(context);
        TypedValue typedValue = new TypedValue();
        context.getTheme().resolveAttribute(R.attr.colorSecondary, typedValue, true);
        defaultBackgroundColor = typedValue.data;
        defaultColor = getCurrentTextColor();
        params = new CoordinatorLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.setBehavior(getBehavior());
        setLayoutParams(params);
        iconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                setIcon(d);
            }
        };
        setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onPress", null);
            }
        });
    }

    void setIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, iconResolverListener, getContext());
    }

    void setActionText(String text) {
        this.text = text;
        textChanged = true;
    }

    void setFontFamily(String fontFamily) {
        this.fontFamily = fontFamily;
        textChanged = true;
    }

    void setFontWeight(String fontWeight) {
        this.fontWeight = fontWeight;
        textChanged = true;
    }

    void setFontStyle(String fontStyle) {
        this.fontStyle = fontStyle;
        textChanged = true;
    }

    void setFontSize(Integer fontSize) {
        this.fontSize = fontSize;
        textChanged = true;
    }

    void styleText() {
        if (textChanged) {
            SpannableString titleSpannable = null;
            if (text != null) {
                titleSpannable = new SpannableString(text);
                if (fontFamily != null)
                    titleSpannable.setSpan(new TypefaceSpan(fontFamily), 0, text.length(), 0);
                if (fontWeight != null)
                    titleSpannable.setSpan(new StyleSpan(ReactTypefaceUtils.parseFontWeight(fontWeight)), 0, text.length(), 0);
                if (fontStyle != null)
                    titleSpannable.setSpan(new StyleSpan(ReactTypefaceUtils.parseFontStyle(fontStyle)), 0, text.length(), 0);
                if (fontSize != null)
                    titleSpannable.setSpan(new AbsoluteSizeSpan(fontSize, true), 0, text.length(), 0);
            }
            setText(titleSpannable);
            textChanged = false;
        }
    }
}
