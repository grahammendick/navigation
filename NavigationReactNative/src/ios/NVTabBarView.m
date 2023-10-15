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
    NSInteger _selectedIndex;
    NSInteger _nativeEventCount;
    bool _firstSceneReselected;
    bool _jsUpdate;
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

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    NSMutableArray *controllers = [NSMutableArray arrayWithArray:[_tabBarController viewControllers]];
    [controllers insertObject:[(NVTabBarItemView *) subview navigationController] atIndex:atIndex];
    [_tabBarController setViewControllers:controllers];
    if (_selectedTab == controllers.count - 1)
        _tabBarController.selectedIndex = _selectedTab;
    ((NVTabBarItemView *) subview).stackDidChangeBlock = ^(NVTabBarItemView *tabBarItemView){
        NSMutableArray *controllers = [NSMutableArray arrayWithArray:[self->_tabBarController viewControllers]];
        [controllers replaceObjectAtIndex:[self.reactSubviews indexOfObject:tabBarItemView] withObject:[tabBarItemView navigationController]];
        [self->_tabBarController setViewControllers:controllers];
    };
}

- (void)removeReactSubview:(UIView *)subview
{
    NSInteger tab = [self.reactSubviews indexOfObject:subview];
    ((NVTabBarItemView *) subview).stackDidChangeBlock = nil;
    [super removeReactSubview:subview];
    NSMutableArray *controllers = [NSMutableArray arrayWithArray:[_tabBarController viewControllers]];
    [controllers removeObjectAtIndex:tab];
    [_tabBarController setViewControllers:controllers];
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    _nativeEventCount = MAX(_nativeEventCount, _mostRecentEventCount);
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    if (eventLag == 0) {
        _selectedIndex = _selectedTab;
    }
    if (_tabBarController.selectedIndex == NSNotFound) {
        _tabBarController.selectedIndex = 0;
    }
    if (_tabBarController.selectedIndex != _selectedIndex) {
        if ([changedProps containsObject:@"selectedTab"]) {
            _tabBarController.selectedIndex = _selectedIndex;
        } else {
            _selectedIndex = _tabBarController.selectedIndex;
        }
        _jsUpdate = true;
        [self selectTab];
        _jsUpdate = false;
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
        NSMutableDictionary *unselectedAttributes = [NSMutableDictionary new];
        NSMutableDictionary *selectedAttributes = [NSMutableDictionary new];
        unselectedAttributes[NSForegroundColorAttributeName] = _unselectedTintColor;
        selectedAttributes[NSForegroundColorAttributeName] = _selectedTintColor;
        if (self.fontFamily || self.fontWeight || self.fontStyle || self.fontSize) {
            unselectedAttributes[NSFontAttributeName] = font;
            selectedAttributes[NSFontAttributeName] = font;
        }
        UITabBarItemAppearance *itemAppearance = [UITabBarItemAppearance new];
        [itemAppearance.normal setBadgeBackgroundColor:_badgeColor];
        [itemAppearance.selected setBadgeBackgroundColor:_badgeColor];
        [itemAppearance.normal setTitleTextAttributes:unselectedAttributes];
        [itemAppearance.selected setTitleTextAttributes:selectedAttributes];
        [itemAppearance.normal setIconColor:_unselectedTintColor];
        [itemAppearance.selected setIconColor:_selectedTintColor];
        appearance.stackedLayoutAppearance = itemAppearance;
        appearance.compactInlineLayoutAppearance = itemAppearance;
        appearance.inlineLayoutAppearance = itemAppearance;
        _tabBarController.tabBar.standardAppearance = appearance;
        [_tabBarController.tabBar setNeedsLayout];
        if (@available(iOS 15.0, *))
            _tabBarController.tabBar.scrollEdgeAppearance = appearance;
    } else {
        [_tabBarController.tabBar setBarTintColor:_barTintColor];
        [_tabBarController.tabBar setUnselectedItemTintColor: _unselectedTintColor];
        [_tabBarController.tabBar setTintColor: _selectedTintColor];
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
    if (_selectedIndex != selectedIndex) {
        _selectedIndex = selectedIndex;
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
    _firstSceneReselected = _selectedIndex == selectedIndex && viewControllers.count == 1;
    return YES;
}

-(void) selectTab
{
    if (!_jsUpdate) {
        _nativeEventCount++;
        self.onTabSelected(@{
            @"tab": @(_selectedIndex),
            @"eventCount": @(_nativeEventCount),
        });
    }
    NVTabBarItemView *tabBarItem = (NVTabBarItemView *)self.reactSubviews[_selectedIndex];
    if (!!tabBarItem.onPress) {
        tabBarItem.onPress(nil);
    }
}

@end
