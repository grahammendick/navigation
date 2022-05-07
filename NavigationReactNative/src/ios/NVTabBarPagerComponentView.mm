#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTabBarPagerComponentView.h"
#import "NVSegmentedTabComponentView.h"
#import "NVTabBarItemComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVTabBarPagerComponentView () <RCTNVTabBarPagerViewProtocol>
@end

@implementation NVTabBarPagerComponentView
{
    UIPageViewController *_pageViewController;
    UIPageViewController *_oldPageViewController;
    UIViewController *_selectedTabView;
    NSMutableArray<UIViewController *> *_tabs;
    NSInteger _nativeEventCount;
    NSInteger _selectedIndex;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVTabBarPagerProps>();
        _props = defaultProps;
    }
    return self;
}

- (void)ensurePageViewController
{
    if (!_pageViewController) {
        [_oldPageViewController willMoveToParentViewController:nil];
        [_oldPageViewController.view removeFromSuperview];
        [_oldPageViewController removeFromParentViewController];
        _pageViewController = [[UIPageViewController alloc] init];
        [self addSubview:_pageViewController.view];
        _tabs = [[NSMutableArray alloc] init];
    }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [self ensurePageViewController];
    const auto &newViewProps = *std::static_pointer_cast<NVTabBarPagerProps const>(props);
    _mostRecentEventCount = newViewProps.mostRecentEventCount;
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    NSInteger selectedTab = newViewProps.selectedTab;
    if (eventLag == 0 && _selectedTab != selectedTab) {
        _selectedTab = selectedTab;
        if (_tabs.count > selectedTab) {
            [self setCurrentTab:selectedTab];
        }
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        [self updateTab];
    });
    [super updateProps:props oldProps:oldProps];
}

- (void)updateTab
{
    if (!!_selectedTabView) {
        NSInteger reselectedTab = [_tabs indexOfObject:_selectedTabView];
        _selectedTab = reselectedTab != NSNotFound ? reselectedTab : MIN(_selectedTab, _tabs.count - 1);
    }
    [self setCurrentTab:_selectedTab];
}

- (NVSegmentedTabComponentView *)getSegmentedTab
{
    for(NSInteger i = 0; i < [self.superview subviews].count; i++) {
        UIView *view = [self.superview subviews][i];
        if ([view isKindOfClass:[NVSegmentedTabComponentView class]])
            return (NVSegmentedTabComponentView *) view;
    }
    return nil;
}

- (void)setCurrentTab:(NSInteger)index
{
    if (index != _selectedIndex) {
        _nativeEventCount++;
        if (_eventEmitter != nullptr) {
            std::static_pointer_cast<NVTabBarPagerEventEmitter const>(_eventEmitter)
                ->onTabSelected(NVTabBarPagerEventEmitter::OnTabSelected{
                    .tab = static_cast<int>(index),
                    .eventCount = static_cast<int>(_nativeEventCount)
                });
            NVTabBarItemComponentView *tabBarItem = ((NVTabBarItemComponentView *) _tabs[index].view);
            [tabBarItem onPress];
        }
    }
    [self getSegmentedTab].segmentedControl.selectedSegmentIndex = index;
    [_pageViewController setViewControllers:@[_tabs[index]] direction:UIPageViewControllerNavigationDirectionForward animated:NO completion:nil];
    _selectedTab = _selectedIndex = index;
    _selectedTabView = _tabs[index];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _oldPageViewController = _pageViewController;
    _pageViewController = nil;
}

#pragma mark - RCTComponentViewProtocol

-(void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self ensurePageViewController];
    UIViewController *viewController = [[UIViewController alloc] init];
    viewController.view = childComponentView;
    [_tabs insertObject:viewController atIndex:index];

}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [childComponentView removeFromSuperview];
    [_tabs objectAtIndex:index].view = nil;
    [_tabs removeObjectAtIndex:index];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVTabBarPagerComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVTabBarPagerCls(void)
{
  return NVTabBarPagerComponentView.class;
}
#endif
