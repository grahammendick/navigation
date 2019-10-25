package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.Drawable;
import android.net.Uri;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.drawee.drawable.ForwardingDrawable;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.DraweeHolder;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.image.QualityInfo;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.PixelUtil;

import androidx.annotation.Nullable;

class IconResolver {
    private Context context;

    IconResolver(Context context) {
        this.context = context;
    }

    private static class DrawableWithIntrinsicSize extends ForwardingDrawable implements Drawable.Callback {
        private final ImageInfo imageInfo;

        DrawableWithIntrinsicSize(Drawable drawable, ImageInfo imageInfo) {
            super(drawable);
            this.imageInfo = imageInfo;
        }

        @Override
        public int getIntrinsicWidth() {
            return imageInfo.getWidth();
        }

        @Override
        public int getIntrinsicHeight() {
            return imageInfo.getHeight();
        }
    }

    abstract static class IconControllerListener extends BaseControllerListener<ImageInfo> {
        private final DraweeHolder holder;
        private IconImageInfo iconImageInfo;

        IconControllerListener(DraweeHolder holder) {
            this.holder = holder;
        }

        void setIconImageInfo(IconImageInfo iconImageInfo) {
            this.iconImageInfo = iconImageInfo;
        }

        @Override
        public void onFinalImageSet(String id, @Nullable ImageInfo imageInfo, @Nullable Animatable animatable) {
            super.onFinalImageSet(id, imageInfo, animatable);
            final ImageInfo info = iconImageInfo != null ? iconImageInfo : imageInfo;
            setDrawable(new DrawableWithIntrinsicSize(holder.getTopLevelDrawable(), info));
        }

        protected abstract void setDrawable(Drawable d);

        @Override
        public void onFailure(String id, Throwable throwable) {
            super.onFailure(id, throwable);
        }
    }

    private static class IconImageInfo implements ImageInfo {
        private int width;
        private int height;

        IconImageInfo(int width, int height) {
            this.width = width;
            this.height = height;
        }

        @Override
        public int getWidth() {
            return width;
        }

        @Override
        public int getHeight() {
            return height;
        }

        @Override
        public QualityInfo getQualityInfo() {
            return null;
        }

    }

    void setIconSource(ReadableMap source, IconControllerListener controllerListener, DraweeHolder holder) {
        String uri = source != null ? source.getString(PROP_ICON_URI) : null;
        if (uri == null) {
            controllerListener.setIconImageInfo(null);
            controllerListener.setDrawable(null);
        } else if (uri.startsWith("http://") || uri.startsWith("https://") || uri.startsWith("file://")) {
            controllerListener.setIconImageInfo(getIconImageInfo(source));
            DraweeController controller = Fresco.newDraweeControllerBuilder()
                    .setUri(Uri.parse(uri))
                    .setControllerListener(controllerListener)
                    .setOldController(holder.getController())
                    .build();
            holder.setController(controller);
            holder.getTopLevelDrawable().setVisible(true, true);
        } else {
            controllerListener.setDrawable(getDrawableByName(uri));
        }
    }

    private int getDrawableResourceByName(String name) {
        return context.getResources().getIdentifier(
                name,
                "drawable",
                context.getPackageName());
    }

    private Drawable getDrawableByName(String name) {
        int drawableResId = getDrawableResourceByName(name);
        if (drawableResId != 0) {
            return context.getResources().getDrawable(getDrawableResourceByName(name));
        } else {
            return null;
        }
    }

    private static final String PROP_ICON_URI = "uri";
    private static final String PROP_ICON_WIDTH = "width";
    private static final String PROP_ICON_HEIGHT = "height";

    IconImageInfo getIconImageInfo(ReadableMap source) {
        if (source.hasKey(PROP_ICON_WIDTH) && source.hasKey(PROP_ICON_HEIGHT)) {
            final int width = Math.round(PixelUtil.toPixelFromDIP(source.getInt(PROP_ICON_WIDTH)));
            final int height = Math.round(PixelUtil.toPixelFromDIP(source.getInt(PROP_ICON_HEIGHT)));
            return new IconImageInfo(width, height);
        } else {
            return null;
        }
    }
}
