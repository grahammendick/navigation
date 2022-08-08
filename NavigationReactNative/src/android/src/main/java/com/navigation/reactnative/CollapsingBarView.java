package com.navigation.reactnative;

import android.content.Context;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;

import com.facebook.react.views.text.ReactTypefaceUtils;
import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.appbar.CollapsingToolbarLayout;

public class CollapsingBarView extends CollapsingToolbarLayout {
    private String titleFontFamily;
    private String titleFontWeight;
    private String titleFontStyle;
    private String largeTitleFontFamily;
    private String largeTitleFontWeight;
    private String largeTitleFontStyle;
    private boolean titleFontChanged = false;
    private boolean largeTitleFontChanged = false;
    final Drawable defaultContentScrim;
    final int defaultTitleTextColor;
    final Typeface defaultCollapsedTitleTypeface;
    final Typeface defaultExpandedTitleTypeface;
    final int defaultTitleCollapseMode;
    private boolean layoutRequested = false;

    public CollapsingBarView(Context context) {
        super(context);
        AppBarLayout.LayoutParams params = new AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.MATCH_PARENT);
        params.setScrollFlags(AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL | AppBarLayout.LayoutParams.SCROLL_FLAG_EXIT_UNTIL_COLLAPSED);
        setLayoutParams(params);
        defaultContentScrim = getContentScrim();
        defaultTitleTextColor = new ToolbarView(context).defaultTitleTextColor;
        defaultCollapsedTitleTypeface = getCollapsedTitleTypeface();
        defaultExpandedTitleTypeface = getExpandedTitleTypeface();
        defaultTitleCollapseMode = getTitleCollapseMode();
    }

    void setTitleFontFamily(String titleFontFamily) {
        this.titleFontFamily = titleFontFamily;
        titleFontChanged = true;
    }

    void setTitleFontWeight(String titleFontWeight) {
        this.titleFontWeight = titleFontWeight;
        titleFontChanged = true;
    }

    void setTitleFontStyle(String titleFontStyle) {
        this.titleFontStyle = titleFontStyle;
        titleFontChanged = true;
    }

    void setLargeTitleFontFamily(String largeTitleFontFamily) {
        this.largeTitleFontFamily = largeTitleFontFamily;
        largeTitleFontChanged = true;
    }

    void setLargeTitleFontWeight(String largeTitleFontWeight) {
        this.largeTitleFontWeight = largeTitleFontWeight;
        titleFontChanged = true;
    }

    void setLargeTitleFontStyle(String largeTitleFontStyle) {
        this.largeTitleFontStyle = largeTitleFontStyle;
        largeTitleFontChanged = true;
    }

    void styleTitle() {
        if (titleFontChanged) {
            if (titleFontFamily != null || titleFontWeight != null || titleFontStyle != null) {
                setCollapsedTitleTypeface(ReactTypefaceUtils.applyStyles(defaultCollapsedTitleTypeface, ReactTypefaceUtils.parseFontStyle(titleFontStyle), ReactTypefaceUtils.parseFontWeight(titleFontWeight), titleFontFamily, getContext().getAssets()));
            } else {
                setCollapsedTitleTypeface(defaultCollapsedTitleTypeface);
            }
        }
        if (largeTitleFontChanged) {
            if (largeTitleFontFamily != null || largeTitleFontWeight != null || largeTitleFontStyle != null) {
                setExpandedTitleTypeface(ReactTypefaceUtils.applyStyles(defaultExpandedTitleTypeface, ReactTypefaceUtils.parseFontStyle(largeTitleFontStyle), ReactTypefaceUtils.parseFontWeight(largeTitleFontWeight), largeTitleFontFamily, getContext().getAssets()));
            } else {
                setExpandedTitleTypeface(defaultExpandedTitleTypeface);
            }
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        requestLayout();
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        if (!layoutRequested) {
            layoutRequested = true;
            post(measureAndLayout);
        }
    }

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            layoutRequested = false;
            measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };
}
