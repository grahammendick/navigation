package com.navigation.reactnative;

import android.content.Context;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.view.MenuItem;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.DraweeHolder;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.image.QualityInfo;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.views.toolbar.DrawableWithIntrinsicSize;

import androidx.annotation.Nullable;

public class IconResolver {
    private Context context;

    public IconResolver(Context context) {
        this.context = context;
    }

    /**
     * Attaches specific icon width & height to a BaseControllerListener which will be used to
     * create the Drawable
     */
    abstract class IconControllerListener extends BaseControllerListener<ImageInfo> {

        private final DraweeHolder mHolder;

        private IconImageInfo mIconImageInfo;

        public IconControllerListener(DraweeHolder holder) {
            mHolder = holder;
        }

        public void setIconImageInfo(IconImageInfo iconImageInfo) {
            mIconImageInfo = iconImageInfo;
        }

        @Override
        public void onFinalImageSet(String id, @Nullable ImageInfo imageInfo, @Nullable Animatable animatable) {
            super.onFinalImageSet(id, imageInfo, animatable);

            final ImageInfo info = mIconImageInfo != null ? mIconImageInfo : imageInfo;
            setDrawable(new DrawableWithIntrinsicSize(mHolder.getTopLevelDrawable(), info));
        }

        protected abstract void setDrawable(Drawable d);

        @Override
        public void onFailure(String id, Throwable throwable) {
            super.onFailure(id, throwable);
        }
    }

    /**
     * Simple implementation of ImageInfo, only providing width & height
     */
    private static class IconImageInfo implements ImageInfo {

        private int mWidth;
        private int mHeight;

        public IconImageInfo(int width, int height) {
            mWidth = width;
            mHeight = height;
        }

        @Override
        public int getWidth() {
            return mWidth;
        }

        @Override
        public int getHeight() {
            return mHeight;
        }

        @Override
        public QualityInfo getQualityInfo() {
            return null;
        }

    }

    class ActionIconControllerListener extends IconControllerListener {
        private final MenuItem mItem;

        ActionIconControllerListener(MenuItem item, DraweeHolder holder) {
            super(holder);
            mItem = item;
        }

        @Override
        protected void setDrawable(Drawable d) {
            mItem.setIcon(d);
        }
    }

    /**
     * Sets an icon for a specific icon source. If the uri indicates an icon
     * to be somewhere remote (http/https) or on the local filesystem, it uses fresco to load it.
     * Otherwise it loads the Drawable from the Resources and directly returns it via a callback
     */
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
