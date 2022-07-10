#import "NVTabBarView.h"
#import "NVTabBarItemView.h"
#import "NVTabBarPagerView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>
#import <React/RCTFont.h>
#import <React/RCTI18nUtil.h>
#import <React/RCTScrollView.h>

@implementation NVTabBarView
{
    UITabBarController *_tabBarController;
    NSInteger _selectedTab;
    NSInteger _nativeEventCount;
    bool _firstSceneReselected;
}

- (id)init
{
    if (self = [super init]) {
        _tabBarController = [[UITabBarController alloc] init];
        _tabBarController.tabBar.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
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
    if (@available(iOS 13.0, *)) {
        UITabBarAppearance *appearance = [UITabBarAppearance new];
        [appearance configureWithDefaultBackground];
        if (_barTintColor) {
            if (CGColorGetAlpha(_barTintColor.CGColor) == 0)
                [appearance configureWithTransparentBackground];
            if (CGColorGetAlpha(_barTintColor.CGColor) == 1)
                [appearance configureWithOpaqueBackground];
            [appearance setBackgroundColor:_barTintColor];
        }
        UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
        NSNumber *size = !self.fontSize ? @10 : self.fontSize;
        NSString *weight = !self.fontWeight ? @"500" : self.fontWeight;
        UIFont *font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:weight style:self.fontStyle variant:nil scaleMultiplier:1];
        NSMutableDictionary *attributes = [NSMutableDictionary new];
        if (self.fontFamily || self.fontWeight || self.fontStyle || self.fontSize) {
            attributes[NSFontAttributeName] = font;
        }
        UITabBarItemAppearance *itemAppearance = [UITabBarItemAppearance new];
        [itemAppearance.normal setBadgeBackgroundColor:_badgeColor];
        [itemAppearance.selected setBadgeBackgroundColor:_badgeColor];
        [itemAppearance.normal setTitleTextAttributes:attributes];
        [itemAppearance.selected setTitleTextAttributes:attributes];
        appearance.stackedLayoutAppearance = itemAppearance;
        appearance.compactInlineLayoutAppearance = itemAppearance;
        _tabBarController.tabBar.standardAppearance = appearance;
        if (@available(iOS 15.0, *))
            _tabBarController.tabBar.scrollEdgeAppearance = appearance;
    } else {
        [_tabBarController.tabBar setBarTintColor:_barTintColor];
    }
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    UIView *parentView = (UIView *)self.superview;
    while (!_tabBarController.parentViewController && parentView) {
        if (parentView.reactViewController) {
            [parentView.reactViewController addChildViewController:_tabBarController];
        }
        parentView = parentView.superview;
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
    if (_firstSceneReselected && _scrollsToTop) {
        UIViewController *sceneController = ((UINavigationController *) viewController).viewControllers[0];
        UIScrollView *scrollView;
        for (UIView *subview in sceneController.view.subviews) {
            if ([subview isKindOfClass:[RCTScrollView class]]){
                scrollView = ((RCTScrollView *) subview).scrollView;
            }
            for (UIView *subsubview in subview.subviews) {
                if ([subsubview isKindOfClass:[NVTabBarPagerView class]]){
                    [((NVTabBarPagerView *) subsubview) scrollToTop];
                }
            }
        }
        CGFloat topLayoutOffset = sceneController.topLayoutGuide.length;
        CGFloat bottomLayoutOffset = sceneController.bottomLayoutGuide.length;
        CGRect safeArea = sceneController.view.bounds;
        safeArea.origin.y += topLayoutOffset;
        safeArea.size.height -= topLayoutOffset + bottomLayoutOffset;
        CGRect localSafeArea = [sceneController.view convertRect:safeArea toView:scrollView];
        CGFloat top = MAX(0, CGRectGetMinY(localSafeArea) - CGRectGetMinY(scrollView.bounds));
        [scrollView setContentOffset:CGPointMake(0, -top) animated:YES];
    }
}

- (BOOL)tabBarController:(UITabBarController *)tabBarController shouldSelectViewController:(UIViewController *)viewController
{
    NSInteger selectedIndex = [tabBarController.viewControllers indexOfObject:viewController];
    NSArray *viewControllers = ((UINavigationController *) viewController).viewControllers;
    _firstSceneReselected = _selectedTab == selectedIndex && viewControllers.count == 1;
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
