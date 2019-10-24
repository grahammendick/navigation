package com.navigation.reactnative;

import android.graphics.drawable.Drawable;

import com.facebook.drawee.drawable.ForwardingDrawable;
import com.facebook.imagepipeline.image.ImageInfo;

public class DrawableWithIntrinsicSize extends ForwardingDrawable implements Drawable.Callback {
    private final ImageInfo mImageInfo;

    DrawableWithIntrinsicSize(Drawable drawable, ImageInfo imageInfo) {
        super(drawable);
        mImageInfo = imageInfo;
    }

    @Override
    public int getIntrinsicWidth() {
        return mImageInfo.getWidth();
    }

    @Override
    public int getIntrinsicHeight() {
        return mImageInfo.getHeight();
    }
}

