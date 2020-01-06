package com.navigation.reactnative;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;

import com.facebook.common.executors.UiThreadImmediateExecutorService;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.BaseDataSubscriber;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.drawable.ForwardingDrawable;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.image.CloseableBitmap;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.image.QualityInfo;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.PixelUtil;

class IconResolver {
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

    interface IconResolverListener {
        void setDrawable(Drawable d);
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
    
    static void setIconSource(ReadableMap source, final IconResolverListener iconResolverListener, final Context context) {
        String uri = source != null ? source.getString(PROP_ICON_URI) : null;
        if (uri == null) {
            iconResolverListener.setDrawable(null);
        } else if (uri.startsWith("http://") || uri.startsWith("https://") || uri.startsWith("file://")) {
            ImagePipeline imagePipeline = Fresco.getImagePipeline();
            ImageRequestBuilder builder = ImageRequestBuilder.newBuilderWithSource(Uri.parse(uri));

            final ImageInfo imageInfo = getIconImageInfo(source);

            ImageRequest request = builder.build();
            DataSource<CloseableReference<CloseableImage>> dataSource = imagePipeline.fetchDecodedImage(request, context);
            dataSource.subscribe(new BaseDataSubscriber<CloseableReference<CloseableImage>>() {
                @Override
                protected void onNewResultImpl(DataSource<CloseableReference<CloseableImage>> dataSource) {
                    if (!dataSource.isFinished()) {
                        return;
                    }

                    CloseableReference<CloseableImage> imageRef = dataSource.getResult();
                    if (imageRef != null) {
                        CloseableImage image = imageRef.get();
                        try {

                            if (image instanceof CloseableBitmap) {
                                Bitmap bitmap = (((CloseableBitmap) image).getUnderlyingBitmap());
                                if (bitmap != null && !bitmap.isRecycled()) {
                                    Bitmap bitmapCopy = bitmap.copy(bitmap.getConfig(), true);
                                    Drawable drawable = new BitmapDrawable(context.getResources(), bitmapCopy);
                                    DrawableWithIntrinsicSize sizedDrawable = new DrawableWithIntrinsicSize(drawable, imageInfo);
                                    iconResolverListener.setDrawable(sizedDrawable);
                                }
                            }
                        } finally {
                            imageRef.close();
                        }
                    }
                }

                @Override
                protected void onFailureImpl(DataSource<CloseableReference<CloseableImage>> dataSource) {
                }
            }, UiThreadImmediateExecutorService.getInstance());
        } else {
            iconResolverListener.setDrawable(getDrawableByName(uri, context));
        }
    }

    private static int getDrawableResourceByName(String name, Context context) {
        return context.getResources().getIdentifier(
                name,
                "drawable",
                context.getPackageName());
    }

    private static Drawable getDrawableByName(String name, Context context) {
        int drawableResId = getDrawableResourceByName(name, context);
        if (drawableResId != 0) {
            return context.getResources().getDrawable(getDrawableResourceByName(name, context));
        } else {
            return null;
        }
    }

    private static final String PROP_ICON_URI = "uri";
    private static final String PROP_ICON_WIDTH = "width";
    private static final String PROP_ICON_HEIGHT = "height";

    private static IconImageInfo getIconImageInfo(ReadableMap source) {
        if (source.hasKey(PROP_ICON_WIDTH) && source.hasKey(PROP_ICON_HEIGHT)) {
            final int width = Math.round(PixelUtil.toPixelFromDIP(source.getInt(PROP_ICON_WIDTH)));
            final int height = Math.round(PixelUtil.toPixelFromDIP(source.getInt(PROP_ICON_HEIGHT)));
            return new IconImageInfo(width, height);
        } else {
            return null;
        }
    }
}
