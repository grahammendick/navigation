#import "NVTabBarPagerView.h"
#import "NVSegmentedTabView.h"
#import "NVTabBarItemView.h"

#import <React/UIView+React.h>
#import <React/RCTScrollView.h>

@implementation NVTabBarPagerView
{
    UIPageViewController *_pageViewController;
    NSMutableArray<UIViewController *> *_tabs;
    NSInteger _nativeEventCount;
}

- (id)init
{
    if (self = [super init]) {
        _pageViewController = [[UIPageViewController alloc] init];
        [self addSubview:_pageViewController.view];
        _tabs = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    UIViewController *viewController = [[UIViewController alloc] init];
    viewController.view = subview;
    [_tabs addObject:viewController];
}

- (void)removeReactSubview:(UIView *)subview
{
    [super removeReactSubview:subview];
    NSInteger index = 0;
    for(NSInteger i = 0; i < [_tabs count]; i++) {
        index = _tabs[i].view == subview ? i : index;
    }
    [_tabs removeObjectAtIndex:index];
}

- (void)didUpdateReactSubviews
{
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    if (!!self.window) {
        [self setCurrentTab:_selectedTab];
        for(NSInteger i = 0; i < [self.superview subviews].count; i++) {
            UIView *view = [self.superview subviews][i];
            if ([view isKindOfClass:[NVSegmentedTabView class]])
                [((NVSegmentedTabView *) view) setupWithPager:self];
        }
    }
}

- (void)setSelectedTab:(NSInteger)selectedTab
{
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    if (eventLag == 0 && _tabs.count > selectedTab) {
        [self setCurrentTab:selectedTab];
    }
}

- (void)setCurrentTab:(NSInteger)index
{
    _nativeEventCount++;
    [self.tabChange tabSelected:index];
    self.onTabSelected(@{
        @"tab": @(index),
        @"eventCount": @(_nativeEventCount),
    });
    NVTabBarItemView *tabBarItem = ((NVTabBarItemView *) _tabs[index].view);
    if (!!tabBarItem.onPress) {
        tabBarItem.onPress(nil);
    }
    [_pageViewController setViewControllers:@[_tabs[index]] direction:UIPageViewControllerNavigationDirectionForward animated:NO completion:nil];
    _selectedTab = index;
}

- (void)scrollToTop
{
    UIView *tabBarItem = _tabs[_selectedTab].view.subviews[0];
    if ([tabBarItem isKindOfClass:[RCTScrollView class]] && _scrollsToTop) {
        UIScrollView *scrollView = ((RCTScrollView *) tabBarItem).scrollView;
        [scrollView setContentOffset:CGPointMake(0, 0) animated:YES];
    }
}

@end
