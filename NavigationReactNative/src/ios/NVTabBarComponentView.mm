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
    NSInteger _selectedTab;
    NSInteger _nativeEventCount;
    bool _preventFouc;
    int _foucCounter;
    bool _firstSceneReselected;
    bool _jsUpdate;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVTabBarProps>();
        _props = defaultProps;
        _tabBarController = [[UITabBarController alloc] init];
        _tabBarController.tabBar.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
        [self addSubview:_tabBarController.view];
        _tabBarController.delegate = self;
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newViewProps = *std::static_pointer_cast<NVTabBarProps const>(props);
    UIColor *selectedTintColor = RCTUIColorFromSharedColor(newViewProps.selectedTintColor);
    UIColor *unselectedTintColor = RCTUIColorFromSharedColor(newViewProps.unselectedTintColor);
    UIColor *barTintColor = RCTUIColorFromSharedColor(newViewProps.barTintColor);
    UIColor *shadowColor = RCTUIColorFromSharedColor(newViewProps.shadowColor);
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
        if (shadowColor) {
            [appearance setShadowColor:shadowColor];
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
        appearance.inlineLayoutAppearance = itemAppearance;
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
    _nativeEventCount = MAX(_nativeEventCount, _mostRecentEventCount);
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    BOOL tabChanged = eventLag == 0 && _selectedTab != newViewProps.selectedTab;
    if (tabChanged)
        _selectedTab = newViewProps.selectedTab;
    if (newViewProps.preventFouc != _preventFouc && newViewProps.preventFouc)
        _foucCounter++;
    NVTabBarItemComponentView *tabBarItem = (NVTabBarItemComponentView *)self.reactSubviews[_tabBarController.selectedIndex];
    tabBarItem.foucCounter = _foucCounter;
    if (_tabBarController.selectedIndex != _selectedTab) {
        if (tabChanged) {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (self->_preventFouc)self->_foucCounter++;
                NVTabBarItemComponentView *tabBarItem = (NVTabBarItemComponentView *)self.reactSubviews[self->_selectedTab];
                tabBarItem.foucCounter = self->_foucCounter;
                self->_tabBarController.selectedIndex = self->_selectedTab;
                self->_jsUpdate = true;
                [self selectTab:self->_selectedTab];
                self->_jsUpdate = false;
            });
        } else {
            _selectedTab = _tabBarController.selectedIndex;
            _jsUpdate = true;
            [self selectTab:_selectedTab];
            _jsUpdate = false;
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
        [self selectTab:_selectedTab];
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
    NVTabBarItemComponentView *tabBarItem = (NVTabBarItemComponentView *)self.reactSubviews[selectedIndex];
    if (tabBarItem.foucCounter == _foucCounter || _selectedTab == selectedIndex) {
        NSArray *viewControllers = ((UINavigationController *) viewController).viewControllers;
        _firstSceneReselected = _selectedTab == selectedIndex && viewControllers.count == 1;
        return YES;
    } else {
        [self selectTab:selectedIndex];
        return NO;
    }
}

-(void)selectTab:(NSInteger)index
{
    if (!_jsUpdate)
        _nativeEventCount++;
    NVTabBarItemComponentView *tabBarItem = (NVTabBarItemComponentView *)self.reactSubviews[index];
    if (_eventEmitter != nullptr) {
        if (!_jsUpdate) {
            std::static_pointer_cast<NVTabBarEventEmitter const>(_eventEmitter)
            ->onTabSelected(NVTabBarEventEmitter::OnTabSelected{
                .tab = static_cast<int>(index),
                .eventCount = static_cast<int>(_nativeEventCount)
            });
        }
        [tabBarItem onPress];
    }
}

#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self insertReactSubview:childComponentView atIndex:index];
    NSMutableArray *controllers = [NSMutableArray arrayWithArray:[_tabBarController viewControllers]];
    [controllers insertObject:[(NVTabBarItemComponentView *) childComponentView navigationController] atIndex:index];
    [_tabBarController setViewControllers:controllers];
    if (_selectedTab == controllers.count - 1)
        _tabBarController.selectedIndex = _selectedTab;
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

+ (BOOL)shouldBeRecycled
{
    return NO;
}

@end

Class<RCTComponentViewProtocol> NVTabBarCls(void)
{
  return NVTabBarComponentView.class;
}
#endif
