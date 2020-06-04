#import "NVTabBarView.h"
#import "NVTabBarItemView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVTabBarView
{
    UITabBarController *_tabBarController;
    NSInteger _selectedTab;
    NSInteger _nativeEventCount;
    bool _doubleSelect;
}

- (id)init
{
    if (self = [super init]) {
        _tabBarController = [[UITabBarController alloc] init];
        [self addSubview:_tabBarController.view];
        _tabBarController.delegate = self;
    }
    return self;
}

- (void)setSelectedTab:(NSInteger)selectedTab
{
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    if (eventLag == 0) {
        _selectedTab = selectedTab;
    }
}

- (void)setBarTintColor:(UIColor *)barTintColor
{
    [_tabBarController.tabBar setBarTintColor:barTintColor];
}

- (void)setSelectedTintColor:(UIColor *)selectedTintColor
{
    [_tabBarController.tabBar setTintColor: selectedTintColor];
}

- (void)setUnselectedTintColor:(UIColor *)unselectedTintColor
{
    if (@available(iOS 10.0, *)) {
        [_tabBarController.tabBar setUnselectedItemTintColor: unselectedTintColor];
    }
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    NSMutableArray *controllers = [NSMutableArray arrayWithArray:[_tabBarController viewControllers]];
    [controllers insertObject:[(NVTabBarItemView *) subview navigationController] atIndex:atIndex];
    [_tabBarController setViewControllers:controllers];
}

- (void)removeReactSubview:(UIView *)subview
{
    NSInteger tab = [self.reactSubviews indexOfObject:subview];
    [super removeReactSubview:subview];
    NSMutableArray *controllers = [NSMutableArray arrayWithArray:[_tabBarController viewControllers]];
    [controllers removeObjectAtIndex:tab];
    [_tabBarController setViewControllers:controllers];
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    if (_tabBarController.selectedIndex == NSNotFound) {
        _tabBarController.selectedIndex = 0;
    }
    if (_tabBarController.selectedIndex != _selectedTab) {
        if ([changedProps containsObject:@"selectedTab"]) {
            _tabBarController.selectedIndex = _selectedTab;
        } else {
            _selectedTab = _tabBarController.selectedIndex;
        }
        [self selectTab];
    }
}

- (void)didUpdateReactSubviews
{
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _tabBarController.view.frame = self.bounds;
}

- (void)dealloc
{
    _tabBarController.delegate = nil;
}

- (void)tabBarController:(UITabBarController *)tabBarController didSelectViewController:(nonnull UIViewController *)viewController
{
    NSInteger selectedIndex = [tabBarController.viewControllers indexOfObject:viewController];
    if (_selectedTab != selectedIndex) {
        _selectedTab = selectedIndex;
        [self selectTab];
    }
    if (_doubleSelect) {
        UIViewController *sceneController = ((UINavigationController *) viewController).viewControllers[0];
        UIScrollView *scrollView =[self findScrollView:sceneController.view];
        [scrollView setContentOffset:CGPointMake(0, -sceneController.topLayoutGuide.length) animated:YES];
    }
}

- (UIScrollView *)findScrollView:(UIView *)parentView
{
    for (UIView *subview in parentView.subviews) {
        if ([subview isKindOfClass:[UIScrollView class]]){
            return (UIScrollView *) subview;
        }
        UIScrollView *scrollView = [self findScrollView:subview];
        if (scrollView != nil) {
            return scrollView;
        }
    }
    return nil;
}

- (BOOL)tabBarController:(UITabBarController *)tabBarController shouldSelectViewController:(UIViewController *)viewController
{
    NSInteger selectedIndex = [tabBarController.viewControllers indexOfObject:viewController];
    NSArray *viewControllers = ((UINavigationController *) viewController).viewControllers;
    _doubleSelect = _selectedTab == selectedIndex && viewControllers.count == 1;
    return YES;
}

-(void) selectTab
{
    _nativeEventCount++;
    NVTabBarItemView *tabBarItem = (NVTabBarItemView *)self.reactSubviews[_selectedTab];
    self.onTabSelected(@{
        @"tab": @(_selectedTab),
        @"eventCount": @(_nativeEventCount),
    });
    if (!!tabBarItem.onPress) {
        tabBarItem.onPress(nil);
    }
}

@end
