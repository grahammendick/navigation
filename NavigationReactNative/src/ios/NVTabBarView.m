#import "NVTabBarView.h"
#import "NVTabBarItemView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVTabBarView
{
    UITabBarController *_tabBarController;
    NSInteger _selectedTab;
    NSInteger _nativeEventCount;
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

- (void) hideTabBar
{
    CGRect screenRect = [[UIScreen mainScreen] bounds];

    [UIView beginAnimations:nil context:NULL];
    [UIView setAnimationDuration:0.25];
    [UIView setAnimationCurve:UIViewAnimationCurveEaseOut];
    float fHeight = screenRect.size.height;
    if(  UIDeviceOrientationIsLandscape([UIApplication sharedApplication].statusBarOrientation) )
    {
        fHeight = screenRect.size.width;
    }

    for(UIView *view in _tabBarController.view.subviews)
    {
        if([view isKindOfClass:[UITabBar class]])
        {
            [view setFrame:CGRectMake(view.frame.origin.x, fHeight, view.frame.size.width, view.frame.size.height)];
        }
        else
        {
            [view setFrame:CGRectMake(view.frame.origin.x, view.frame.origin.y, view.frame.size.width, fHeight)];
            view.backgroundColor = [UIColor blackColor];
        }
    }
    [UIView commitAnimations];
}



- (void) showTabBar
{
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    float fHeight = screenRect.size.height - _tabBarController.tabBar.frame.size.height;

    if(  UIDeviceOrientationIsLandscape([UIApplication sharedApplication].statusBarOrientation) )
    {
        fHeight = screenRect.size.width - _tabBarController.tabBar.frame.size.height;
    }

    [UIView beginAnimations:nil context:NULL];
    [UIView setAnimationDuration:0.25];
    [UIView setAnimationCurve:UIViewAnimationCurveEaseOut];
    for(UIView *view in _tabBarController.view.subviews)
    {
        if([view isKindOfClass:[UITabBar class]])
        {
            [view setFrame:CGRectMake(view.frame.origin.x, fHeight, view.frame.size.width, view.frame.size.height)];
        }
        else
        {
            [view setFrame:CGRectMake(view.frame.origin.x, view.frame.origin.y, view.frame.size.width, fHeight)];
        }
    }
    [UIView commitAnimations];
}

@end
