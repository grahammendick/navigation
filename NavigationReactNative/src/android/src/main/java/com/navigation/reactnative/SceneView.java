package com.navigation.reactnative;

import android.content.Context;
import android.graphics.Rect;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.Surface;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.WindowManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.deviceinfo.DeviceInfoModule;
import com.facebook.react.uimanager.DisplayMetricsHolder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.HashSet;

public class SceneView extends ViewGroup {
    protected String sceneKey;
    protected String enterAnim;
    protected String exitAnim;
    public HashSet<View> sharedElements = new HashSet<>();
    public SharedElementTransitioner transitioner;
    private CustomGlobalLayoutListener customGlobalLayoutListener;
    boolean fragmentMode;

    public SceneView(Context context) {
        super(context);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (fragmentMode) {
            if (customGlobalLayoutListener == null)
                customGlobalLayoutListener = new CustomGlobalLayoutListener();
            getViewTreeObserver().addOnGlobalLayoutListener(customGlobalLayoutListener);
            View child = getChildAt(0);
            if (child != null && child.getClass().getSimpleName().contains("DrawerLayout")) {
                child.requestLayout();
                post(measureAndLayout);
            }
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        if (fragmentMode)
            getViewTreeObserver().removeOnGlobalLayoutListener(customGlobalLayoutListener);
    }

    private final Runnable measureAndLayout =
        new Runnable() {
            @Override
            public void run() {
                View child = getChildAt(0);
                child.measure(
                    MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
                child.layout(child.getLeft(), child.getTop(), child.getRight(), child.getBottom());
            }
        };

    protected void popped() {
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onPopped", null);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }

    void sendEvent(String eventName, WritableMap params) {
        ((ReactContext) getContext())
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    private class CustomGlobalLayoutListener implements ViewTreeObserver.OnGlobalLayoutListener {
        private final Rect mVisibleViewArea;
        private final int mMinKeyboardHeightDetected;

        private int mKeyboardHeight = 0;
        private int mDeviceRotation = 0;
        private DisplayMetrics mWindowMetrics = new DisplayMetrics();
        private DisplayMetrics mScreenMetrics = new DisplayMetrics();

        CustomGlobalLayoutListener() {
            DisplayMetricsHolder.initDisplayMetricsIfNotInitialized(getContext().getApplicationContext());
            mVisibleViewArea = new Rect();
            mMinKeyboardHeightDetected = (int) PixelUtil.toPixelFromDIP(60);
        }

        @Override
        public void onGlobalLayout() {
            checkForKeyboardEvents();
            checkForDeviceOrientationChanges();
            checkForDeviceDimensionsChanges();
        }

        private void checkForKeyboardEvents() {
            getRootView().getWindowVisibleDisplayFrame(mVisibleViewArea);
            final int heightDiff =
                DisplayMetricsHolder.getWindowDisplayMetrics().heightPixels - mVisibleViewArea.bottom;
            if (mKeyboardHeight != heightDiff && heightDiff > mMinKeyboardHeightDetected) {
                mKeyboardHeight = heightDiff;
                WritableMap params = Arguments.createMap();
                WritableMap coordinates = Arguments.createMap();
                coordinates.putDouble("screenY", PixelUtil.toDIPFromPixel(mVisibleViewArea.bottom));
                coordinates.putDouble("screenX", PixelUtil.toDIPFromPixel(mVisibleViewArea.left));
                coordinates.putDouble("width", PixelUtil.toDIPFromPixel(mVisibleViewArea.width()));
                coordinates.putDouble("height", PixelUtil.toDIPFromPixel(mKeyboardHeight));
                params.putMap("endCoordinates", coordinates);
                sendEvent("keyboardDidShow", params);
            } else if (mKeyboardHeight != 0 && heightDiff <= mMinKeyboardHeightDetected) {
                mKeyboardHeight = 0;
                sendEvent("keyboardDidHide", null);
            }
        }

        private void checkForDeviceOrientationChanges() {
            final int rotation =
                ((WindowManager) getContext().getSystemService(Context.WINDOW_SERVICE))
                    .getDefaultDisplay().getRotation();
            if (mDeviceRotation == rotation) {
                return;
            }
            mDeviceRotation = rotation;
            emitOrientationChanged(rotation);
        }

        private void checkForDeviceDimensionsChanges() {
            DisplayMetricsHolder.initDisplayMetrics(((ReactContext) getContext()).getCurrentActivity());
            if (!areMetricsEqual(mWindowMetrics, DisplayMetricsHolder.getWindowDisplayMetrics()) ||
                !areMetricsEqual(mScreenMetrics, DisplayMetricsHolder.getScreenDisplayMetrics())) {
                mWindowMetrics.setTo(DisplayMetricsHolder.getWindowDisplayMetrics());
                mScreenMetrics.setTo(DisplayMetricsHolder.getScreenDisplayMetrics());
                emitUpdateDimensionsEvent();
            }
        }

        private boolean areMetricsEqual(DisplayMetrics displayMetrics, DisplayMetrics otherMetrics) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                return displayMetrics.equals(otherMetrics);
            } else {
                return displayMetrics.widthPixels == otherMetrics.widthPixels &&
                    displayMetrics.heightPixels == otherMetrics.heightPixels &&
                    displayMetrics.density == otherMetrics.density &&
                    displayMetrics.densityDpi == otherMetrics.densityDpi &&
                    displayMetrics.scaledDensity == otherMetrics.scaledDensity &&
                    displayMetrics.xdpi == otherMetrics.xdpi &&
                    displayMetrics.ydpi == otherMetrics.ydpi;
            }
        }

        private void emitOrientationChanged(final int newRotation) {
            String name;
            double rotationDegrees;
            boolean isLandscape = false;

            switch (newRotation) {
                case Surface.ROTATION_0:
                    name = "portrait-primary";
                    rotationDegrees = 0.0;
                    break;
                case Surface.ROTATION_90:
                    name = "landscape-primary";
                    rotationDegrees = -90.0;
                    isLandscape = true;
                    break;
                case Surface.ROTATION_180:
                    name = "portrait-secondary";
                    rotationDegrees = 180.0;
                    break;
                case Surface.ROTATION_270:
                    name = "landscape-secondary";
                    rotationDegrees = 90.0;
                    isLandscape = true;
                    break;
                default:
                    return;
            }
            WritableMap map = Arguments.createMap();
            map.putString("name", name);
            map.putDouble("rotationDegrees", rotationDegrees);
            map.putBoolean("isLandscape", isLandscape);

            sendEvent("namedOrientationDidChange", map);
        }

        private void emitUpdateDimensionsEvent() {
            ((ReactContext) getContext())
                .getNativeModule(DeviceInfoModule.class)
                .emitUpdateDimensionsEvent();
        }
    }
}
