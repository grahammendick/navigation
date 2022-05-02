#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTabBarComponentView.h"
#import "NVTabBarItemComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/UIView+React.h>
#import <React/RCTI18nUtil.h>
#import <React/RCTScrollView.h>

using namespace facebook::react;

@interface NVTabBarComponentView () <RCTNVTabBarViewProtocol>
@end

@implementation NVTabBarComponentView
{
    UITabBarController *_tabBarController;
    NSInteger _selectedTab;
    NSInteger _nativeEventCount;
    bool _firstSceneReselected;
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
            if ([subview isKindOfClass:[RCTScrollView class]]){
                scrollView = ((RCTScrollView *) subview).scrollView;
            }
            for (UIView *subsubview in subview.subviews) {
                /*if ([subsubview isKindOfClass:[NVTabBarPagerView class]]){
                    [((NVTabBarPagerView *) subsubview) scrollToTop];
                }*/
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
    NVTabBarItemComponentView *tabBarItem = (NVTabBarItemComponentView *)self.subviews[_selectedTab];
    /*self.onTabSelected(@{
        @"tab": @(_selectedTab),
        @"eventCount": @(_nativeEventCount),
    });
    if (!!tabBarItem.onPress) {
        tabBarItem.onPress(nil);
    }*/
}

#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    NSMutableArray *controllers = [NSMutableArray arrayWithArray:[_tabBarController viewControllers]];
    [controllers insertObject:[(NVTabBarItemComponentView *) childComponentView navigationController] atIndex:index];
    [_tabBarController setViewControllers:controllers];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    NSMutableArray *controllers = [NSMutableArray arrayWithArray:[_tabBarController viewControllers]];
    [controllers removeObjectAtIndex:index];
    [_tabBarController setViewControllers:controllers];

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
