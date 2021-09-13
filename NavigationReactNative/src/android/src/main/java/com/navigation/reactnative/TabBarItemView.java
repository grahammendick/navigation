package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.text.SpannableString;
import android.text.style.AbsoluteSizeSpan;
import android.text.style.StyleSpan;
import android.text.style.TypefaceSpan;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.text.ReactTypefaceUtils;

import java.util.ArrayList;
import java.util.List;

public class TabBarItemView extends ViewGroup {
    protected int index;
    CharSequence styledTitle;
    private String title;
    private String fontFamily;
    private String fontWeight;
    private String fontStyle;
    private Integer fontSize;
    private boolean titleChanged = false;
    private Drawable icon;
    private TabView tabView;
    private Integer badge;
    private Integer badgeColor;
    private Integer defaultBadgeColor;
    private String testID;
    List<View> content = new ArrayList<>();
    private final IconResolver.IconResolverListener tabIconResolverListener;

    public TabBarItemView(Context context) {
        super(context);
        tabIconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                icon = d;
                if (tabView != null)
                    tabView.setIcon(index, icon);
            }
        };
    }

    void setTitle(String title) {
        this.title = title;
        titleChanged = true;
    }

    void setFontFamily(String fontFamily) {
        this.fontFamily = fontFamily;
        titleChanged = true;
    }

    void setFontWeight(String fontWeight) {
        this.fontWeight = fontWeight;
        titleChanged = true;
    }

    void setFontStyle(String fontStyle) {
        this.fontStyle = fontStyle;
        titleChanged = true;
    }

    void setFontSize(Integer fontSize) {
        this.fontSize = fontSize;
        titleChanged = true;
    }

    void setIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, tabIconResolverListener, getContext());
    }

    void setBadge(@Nullable Integer badge) {
        this.badge = badge;
        if (tabView == null)
            return;
        try {
            if (badge != null)
                tabView.getBadgeIcon(index).setNumber(badge);
            else
                tabView.removeBadgeIcon(index);
        } catch(IllegalArgumentException ignored) {
        }
        setBadgeColor(badgeColor);
    }

    void setBadgeColor(@Nullable Integer badgeColor) {
        this.badgeColor = badgeColor;
        if (tabView == null || badge == null)
            return;
        try {
            if (defaultBadgeColor == null)
                defaultBadgeColor = tabView.getBadgeIcon(index).getBackgroundColor();
            if (badgeColor != null)
                tabView.getBadgeIcon(index).setBackgroundColor(badgeColor);
            else
                tabView.getBadgeIcon(index).setBackgroundColor(defaultBadgeColor);
        } catch(IllegalArgumentException ignored) {
        }
    }

    void setTestID(String testID) {
        this.testID = testID;
        if (tabView == null)
            return;
        this.tabView.setTestID(index, testID);
    }

    void setTabView(TabView tabView, int index) {
        this.tabView = tabView;
        this.index = index;
        if (icon != null)
            tabView.setIcon(index, icon);
        setBadge(badge);
        tabView.setTitle(index, styledTitle);
        tabView.setTestID(index, testID);
    }

    void styleTitle() {
        if (titleChanged) {
            SpannableString titleSpannable = null;
            if (title != null) {
                titleSpannable = new SpannableString(title);
                if (fontFamily != null)
                    titleSpannable.setSpan(new TypefaceSpan(fontFamily), 0, title.length(), 0);
                if (fontWeight != null)
                    titleSpannable.setSpan(new StyleSpan(ReactTypefaceUtils.parseFontWeight(fontWeight)), 0, title.length(), 0);
                if (fontStyle != null)
                    titleSpannable.setSpan(new StyleSpan(ReactTypefaceUtils.parseFontStyle(fontStyle)), 0, title.length(), 0);
                if (fontSize != null)
                    titleSpannable.setSpan(new AbsoluteSizeSpan(fontSize, true), 0, title.length(), 0);
            }
            styledTitle = titleSpannable;
            if (tabView != null)
                tabView.setTitle(index, styledTitle);
            titleChanged = false;
        }
    }

    protected void pressed() {
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onPress", null);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
