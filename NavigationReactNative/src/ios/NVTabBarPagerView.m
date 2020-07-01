#import "NVTabBarPagerView.h"
#import "NVSegmentedTabView.h"
#import "NVTabBarItemView.h"

#import <React/UIView+React.h>
#import <React/RCTScrollView.h>

@implementation NVTabBarPagerView
{
    UIPageViewController *_pageViewController;
    UIViewController *_selectedTabView;
    NSMutableArray<UIViewController *> *_tabs;
    NSInteger _nativeEventCount;
    NSInteger _selectedIndex;
}

- (id)init
{
    if (self = [super init]) {
        _pageViewController = [[UIPageViewController alloc] init];
        [self addSubview:_pageViewController.view];
        _tabs = [[NSMutableArray alloc] init];
        _selectedIndex = 0;
    }
    return self;
}

- (void)setSelectedTab:(NSInteger)selectedTab
{
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    if (eventLag == 0 && _selectedTab != selectedTab) {
        _selectedTab = selectedTab;
        if (_tabs.count > selectedTab) {
            [self setCurrentTab:selectedTab];
        }
    }
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    UIViewController *viewController = [[UIViewController alloc] init];
    viewController.view = subview;
    [_tabs insertObject:viewController atIndex:atIndex];
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
    if (!!_selectedTabView) {
        NSInteger reselectedTab = [_tabs indexOfObject:_selectedTabView];
        _selectedTab = reselectedTab != NSNotFound ? reselectedTab : MIN(_selectedTab, _tabs.count - 1);
    }
    [self setCurrentTab:_selectedTab];
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [self getSegmentedTab].selectedSegmentIndex = _selectedTab;
}

- (NVSegmentedTabView *)getSegmentedTab
{
    for(NSInteger i = 0; i < [self.superview subviews].count; i++) {
        UIView *view = [self.superview subviews][i];
        if ([view isKindOfClass:[NVSegmentedTabView class]])
            return (NVSegmentedTabView *) view;
    }
    return nil;
}

- (void)setCurrentTab:(NSInteger)index
{
    if (index != _selectedIndex) {
        _nativeEventCount++;
        self.onTabSelected(@{
            @"tab": @(index),
            @"eventCount": @(_nativeEventCount),
        });
        NVTabBarItemView *tabBarItem = ((NVTabBarItemView *) _tabs[index].view);
        if (!!tabBarItem.onPress) {
            tabBarItem.onPress(nil);
        }
    }
    [self getSegmentedTab].selectedSegmentIndex = index;
    [_pageViewController setViewControllers:@[_tabs[index]] direction:UIPageViewControllerNavigationDirectionForward animated:NO completion:nil];
    _selectedTab = _selectedIndex = index;
    _selectedTabView = _tabs[index];
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
