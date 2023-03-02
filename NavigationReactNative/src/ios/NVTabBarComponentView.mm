#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTabBarComponentView.h"
#import "NVTabBarItemComponentView.h"
#import "NVTabBarPagerComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/UIView+React.h>
#import <React/RCTConversions.h>
#import <React/RCTFont.h>
#import <React/RCTI18nUtil.h>
#import <React/RCTScrollViewComponentView.h>

using namespace facebook::react;

@interface NVTabBarComponentView () <RCTNVTabBarViewProtocol>
@end

@implementation NVTabBarComponentView
{
    UITabBarController *_tabBarController;
    UITabBarController *_oldTabBarController;
    NSInteger _selectedTab;
    NSInteger _nativeEventCount;
    bool _firstSceneReselected;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVTabBarProps>();
        _props = defaultProps;
    }
    return self;
}

- (void)ensureTabBarController
{
    if (!_tabBarController) {
        [_oldTabBarController willMoveToParentViewController:nil];
        [_oldTabBarController.view removeFromSuperview];
        [_oldTabBarController removeFromParentViewController];
        _tabBarController = [[UITabBarController alloc] init];
        _tabBarController.tabBar.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
        [self addSubview:_tabBarController.view];
        _tabBarController.delegate = self;
    }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [self ensureTabBarController];
    const auto &newViewProps = *std::static_pointer_cast<NVTabBarProps const>(props);
    UIColor *selectedTintColor = RCTUIColorFromSharedColor(newViewProps.selectedTintColor);
    UIColor *unselectedTintColor = RCTUIColorFromSharedColor(newViewProps.unselectedTintColor);
    UIColor *barTintColor = RCTUIColorFromSharedColor(newViewProps.barTintColor);
    if (@available(iOS 13.0, *)) {
        UITabBarAppearance *appearance = [UITabBarAppearance new];
        [appearance configureWithDefaultBackground];
        if (barTintColor) {
            if (CGColorGetAlpha(barTintColor.CGColor) == 0)
                [appearance configureWithTransparentBackground];
            if (CGColorGetAlpha(barTintColor.CGColor) == 1)
                [appearance configureWithOpaqueBackground];
            [appearance setBackgroundColor:barTintColor];
        }
        _fontFamily = [[NSString alloc] initWithUTF8String: newViewProps.fontFamily.c_str()];
        _fontFamily = _fontFamily.length ? _fontFamily : nil;
        _fontWeight = [[NSString alloc] initWithUTF8String: newViewProps.fontWeight.c_str()];
        _fontWeight = _fontWeight.length ? _fontWeight : nil;
        _fontStyle = [[NSString alloc] initWithUTF8String: newViewProps.fontStyle.c_str()];
        _fontStyle = _fontStyle.length ? _fontStyle : nil;
        _fontSize = @(newViewProps.fontSize);
        _fontSize = [_fontSize intValue] >= 0 ? _fontSize : nil;
        UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
        NSNumber *size = !self.fontSize ? @10 : self.fontSize;
        NSString *weight = !self.fontWeight ? @"500" : self.fontWeight;
        UIFont *font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:weight style:self.fontStyle variant:nil scaleMultiplier:1];
        NSMutableDictionary *unselectedAttributes = [NSMutableDictionary new];
        NSMutableDictionary *selectedAttributes = [NSMutableDictionary new];
        unselectedAttributes[NSForegroundColorAttributeName] = unselectedTintColor;
        selectedAttributes[NSForegroundColorAttributeName] = selectedTintColor;        if (self.fontFamily || self.fontWeight || self.fontStyle || self.fontSize) {
            unselectedAttributes[NSFontAttributeName] = font;
            selectedAttributes[NSFontAttributeName] = font;
        }
        UITabBarItemAppearance *itemAppearance = [UITabBarItemAppearance new];
        UIColor *badgeColor = RCTUIColorFromSharedColor(newViewProps.badgeColor);
        [itemAppearance.normal setBadgeBackgroundColor:badgeColor];
        [itemAppearance.selected setBadgeBackgroundColor:badgeColor];
        [itemAppearance.normal setTitleTextAttributes:unselectedAttributes];
        [itemAppearance.selected setTitleTextAttributes:selectedAttributes];
        [itemAppearance.normal setIconColor:unselectedTintColor];
        [itemAppearance.selected setIconColor:selectedTintColor];
        appearance.stackedLayoutAppearance = itemAppearance;
        appearance.compactInlineLayoutAppearance = itemAppearance;
        _tabBarController.tabBar.standardAppearance = appearance;
        [_tabBarController.tabBar setNeedsLayout];
        if (@available(iOS 15.0, *))
            _tabBarController.tabBar.scrollEdgeAppearance = appearance;
    } else {
        [_tabBarController.tabBar setBarTintColor:barTintColor];
        [_tabBarController.tabBar setTintColor: selectedTintColor];
        [_tabBarController.tabBar setUnselectedItemTintColor: unselectedTintColor];
    }
    _mostRecentEventCount = newViewProps.mostRecentEventCount;
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    BOOL tabChanged = eventLag == 0 && _selectedTab != newViewProps.selectedTab;
    if (tabChanged)
        _selectedTab = newViewProps.selectedTab;
    if (_tabBarController.selectedIndex != _selectedTab) {
        if (tabChanged) {
            dispatch_async(dispatch_get_main_queue(), ^{
                self->_tabBarController.selectedIndex = self->_selectedTab;
                [self selectTab];
            });
        } else {
            _selectedTab = _tabBarController.selectedIndex;
            [self selectTab];
        }
    }
    _scrollsToTop = newViewProps.scrollsToTop;
    [super updateProps:props oldProps:oldProps];
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
            if ([subview isKindOfClass:[RCTScrollViewComponentView class]]){
                scrollView = ((RCTScrollViewComponentView *) subview).scrollView;
            }
            for (UIView *subsubview in subview.subviews) {
                if ([subsubview isKindOfClass:[NVTabBarPagerComponentView class]]){
                    [((NVTabBarPagerComponentView *) subsubview) scrollToTop];
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
    NVTabBarItemComponentView *tabBarItem = (NVTabBarItemComponentView *)self.reactSubviews[_selectedTab];
    if (_eventEmitter != nullptr) {
        std::static_pointer_cast<NVTabBarEventEmitter const>(_eventEmitter)
            ->onTabSelected(NVTabBarEventEmitter::OnTabSelected{
                .tab = static_cast<int>(_selectedTab),
                .eventCount = static_cast<int>(_nativeEventCount)
            });
        [tabBarItem onPress];
    }
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _nativeEventCount = 0;
    _selectedTab = 0;
    _firstSceneReselected = NO;
    _oldTabBarController = _tabBarController;
    _tabBarController = nil;
}


#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self ensureTabBarController];
    [self insertReactSubview:childComponentView atIndex:index];
    NSMutableArray *controllers = [NSMutableArray arrayWithArray:[_tabBarController viewControllers]];
    [controllers insertObject:[(NVTabBarItemComponentView *) childComponentView navigationController] atIndex:index];
    [_tabBarController setViewControllers:controllers];
    ((NVTabBarItemComponentView *) childComponentView).stackDidChangeBlock = ^(NVTabBarItemComponentView *tabBarItemView){
        NSMutableArray *controllers = [NSMutableArray arrayWithArray:[self->_tabBarController viewControllers]];
        [controllers insertObject:[tabBarItemView navigationController] atIndex: [self.reactSubviews indexOfObject:tabBarItemView]];
        [self->_tabBarController setViewControllers:controllers];
    };
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self removeReactSubview:childComponentView];
    ((NVTabBarItemComponentView *) childComponentView).stackDidChangeBlock = nil;
    NSMutableArray *controllers = [NSMutableArray arrayWithArray:[_tabBarController viewControllers]];
    [controllers removeObjectAtIndex:index];
    [_tabBarController setViewControllers:controllers];
    [childComponentView removeFromSuperview];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVTabBarComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVTabBarCls(void)
{
  return NVTabBarComponentView.class;
}
#endif
