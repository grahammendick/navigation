package com.navigation.reactnative;

import android.content.Context;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewGroup;
import android.widget.ScrollView;

import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.core.view.ViewCompat;
import androidx.viewpager2.widget.ViewPager2;

import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.facebook.react.uimanager.ReactZIndexedViewGroup;
import com.facebook.react.uimanager.ViewGroupDrawingOrderHelper;
import com.facebook.react.uimanager.events.NativeGestureUtil;

public class CoordinatorLayoutView extends CoordinatorLayout implements ReactZIndexedViewGroup {
    int overlap = 0;
    private boolean dragging = false;
    private final int touchSlop;
    private int lastMotionY;
    private int activePointerId;
    private final int[] scrollOffset = new int[2];
    private final int[] scrollConsumed = new int[2];
    private boolean layoutRequested = false;
    private final ViewGroupDrawingOrderHelper drawingOrderHelper;

    public CoordinatorLayoutView(Context context){
        super(context);
        ViewCompat.setLayoutDirection(this, !I18nUtil.getInstance().isRTL(context) ? ViewCompat.LAYOUT_DIRECTION_LTR : ViewCompat.LAYOUT_DIRECTION_RTL);
        touchSlop = ViewConfiguration.get(context).getScaledTouchSlop();
        drawingOrderHelper = new ViewGroupDrawingOrderHelper(this);
    }

    @Override
    public void onAttachedToWindow() {
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

    void scrollToTop() {
        for(int i = 0; i < getChildCount(); i++) {
            if (getChildAt(i) instanceof NavigationBarView)
                ((NavigationBarView) getChildAt(i)).setExpanded(true);
            if (getChildAt(i) instanceof ScrollView)
                ((ScrollView) getChildAt(i)).smoothScrollTo(0,0);
            if (getChildAt(i) instanceof TabBarPagerView)
                ((TabBarPagerView) getChildAt(i)).scrollToTop();
            if (getChildAt(i) instanceof ViewPager2)
                TabBarPagerRTLManager.getAdapter((ViewPager2) getChildAt(i)).scrollToTop();
        }
    }

    ScrollView getScrollView() {
        for(int i = 0; i < getChildCount(); i++) {
            if (getChildAt(i) instanceof ScrollView)
                return (ScrollView) getChildAt(i);
            if (getChildAt(i) instanceof TabBarPagerView) {
                TabBarPagerView tabBarView = ((TabBarPagerView) getChildAt(i));
                View tab = tabBarView.getTabAt(tabBarView.getCurrentItem()).content.get(0);
                return tab instanceof ScrollView ? (ScrollView) tab : null;
            }
            if (getChildAt(i) instanceof ViewPager2) {
                ViewPager2 tabBarView = ((ViewPager2) getChildAt(i));
                View tab = TabBarPagerRTLManager.getAdapter(tabBarView).getTabAt(tabBarView.getCurrentItem()).content.get(0);
                return tab instanceof ScrollView ? (ScrollView) tab : null;
            }
        }
        return null;
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        ScrollView scrollView = getScrollView();
        boolean cannotScroll = scrollView != null && scrollView.getScrollY() == 0 && !scrollView.canScrollVertically(1);
        if (cannotScroll) {
            int action = ev.getAction();
            switch (action & MotionEvent.ACTION_MASK) {
                case MotionEvent.ACTION_DOWN: {
                    dragging = false;
                    lastMotionY = (int) ev.getY();
                    activePointerId = ev.getPointerId(0);
                    break;
                }
                case MotionEvent.ACTION_MOVE:
                    int activePointerIndex = ev.findPointerIndex(activePointerId);
                    int y = (int) ev.getY(activePointerIndex);
                    int deltaY = lastMotionY - y;
                    if (Math.abs(deltaY) > touchSlop)
                        dragging = true;
                    break;
            }
        }
        if (dragging)
            NativeGestureUtil.notifyNativeGestureStarted(this, ev);
        return super.onInterceptTouchEvent(ev) || dragging;
    }

    @Override
    public boolean onTouchEvent(MotionEvent ev) {
        if (dragging) {
            ScrollView scrollView = getScrollView();
            int action = ev.getAction();
            switch (action & MotionEvent.ACTION_MASK) {
                case MotionEvent.ACTION_MOVE: {
                    scrollView.startNestedScroll(SCROLL_AXIS_VERTICAL);
                    int activePointerIndex = ev.findPointerIndex(activePointerId);
                    int y = (int) ev.getY(activePointerIndex);
                    int deltaY = lastMotionY - y;
                    lastMotionY = y;
                    if (scrollView.dispatchNestedPreScroll(0, deltaY, scrollConsumed, scrollOffset))
                        deltaY -= scrollConsumed[1];
                    scrollView.dispatchNestedScroll(0, 0, 0, deltaY, scrollOffset);
                    break;
                }
                case MotionEvent.ACTION_CANCEL:
                case MotionEvent.ACTION_UP:
                    dragging = false;
                    scrollView.stopNestedScroll();
                    break;
            }
        }
        return super.onTouchEvent(ev) || dragging;
    }

    @Override
    public void addView(View child, int index, ViewGroup.LayoutParams params) {
        drawingOrderHelper.handleAddView(child);
        setChildrenDrawingOrderEnabled(drawingOrderHelper.shouldEnableCustomDrawingOrder());
        super.addView(child, index, params);
    }

    @Override
    public void removeView(View view) {
        drawingOrderHelper.handleRemoveView(view);
        setChildrenDrawingOrderEnabled(drawingOrderHelper.shouldEnableCustomDrawingOrder());
        super.removeView(view);
    }

    @Override
    public void removeViewAt(int index) {
        drawingOrderHelper.handleRemoveView(getChildAt(index));
        setChildrenDrawingOrderEnabled(drawingOrderHelper.shouldEnableCustomDrawingOrder());
        super.removeViewAt(index);
    }

    @Override
    public int getZIndexMappedChildIndex(int index) {
        return drawingOrderHelper.getChildDrawingOrder(getChildCount(), index);
    }

    @Override
    public void updateDrawingOrder() {
        drawingOrderHelper.update();
        setChildrenDrawingOrderEnabled(drawingOrderHelper.shouldEnableCustomDrawingOrder());
        invalidate();
    }
}
