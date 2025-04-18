package com.navigation.reactnative;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;

import com.facebook.common.executors.UiThreadImmediateExecutorService;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.BaseDataSubscriber;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.image.CloseableBitmap;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.PixelUtil;

class IconResolver {
    private static final String PROP_ICON_URI = "uri";
    private static final String PROP_ICON_WIDTH = "width";
    private static final String PROP_ICON_HEIGHT = "height";

    private static class DrawableWithIntrinsicSize extends BitmapDrawable {
        private final int width;
        private final int height;

        DrawableWithIntrinsicSize(Resources resources, Bitmap bitmap, ReadableMap source) {
            super(resources, bitmap);
            width = source.hasKey(PROP_ICON_WIDTH)
                    ? Math.round(PixelUtil.toPixelFromDIP(source.getInt(PROP_ICON_WIDTH)))
                    : bitmap.getWidth();
            height = source.hasKey(PROP_ICON_HEIGHT)
                    ? Math.round(PixelUtil.toPixelFromDIP(source.getInt(PROP_ICON_HEIGHT)))
                    : bitmap.getHeight();
        }

        @Override
        public int getIntrinsicWidth() {
            return width;
        }

        @Override
        public int getIntrinsicHeight() {
            return height;
        }
    }

    interface IconResolverListener {
        void setDrawable(Drawable d);
    }

    static void setIconSource(final ReadableMap source, final IconResolverListener iconResolverListener, final Context context) {
        String uri = source != null ? source.getString(PROP_ICON_URI) : null;
        if (uri == null) {
            iconResolverListener.setDrawable(null);
        } else if (uri.startsWith("http://") || uri.startsWith("https://") || uri.startsWith("file://")|| uri.startsWith("data:image")) {
            ImagePipeline imagePipeline = Fresco.getImagePipeline();
            ImageRequestBuilder builder = ImageRequestBuilder.newBuilderWithSource(Uri.parse(uri));
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
                                    Drawable drawable = new DrawableWithIntrinsicSize(context.getResources(), bitmapCopy, source);
                                    iconResolverListener.setDrawable(drawable);
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
            int drawableResId = context.getResources().getIdentifier(uri, "drawable", context.getPackageName());
            if (drawableResId != 0)
                iconResolverListener.setDrawable(context.getResources().getDrawable(drawableResId));
        }
    }
}
