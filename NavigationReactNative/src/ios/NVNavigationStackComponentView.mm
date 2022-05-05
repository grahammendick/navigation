#ifdef RCT_NEW_ARCH_ENABLED
#import "NVNavigationStackComponentView.h"
#import "NVSceneComponentView.h"
#import "NVNavigationStackView.h"
#import "NVSceneComponentView.h"
#import "NVSceneController.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTI18nUtil.h>
#import <React/UIView+React.h>

using namespace facebook::react;

@interface NVNavigationStackComponentView () <RCTNVNavigationStackViewProtocol>
@end

@implementation NVNavigationStackComponentView
{
    NSMutableDictionary *_scenes;
    NSInteger _nativeEventCount;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVNavigationStackProps>();
        _props = defaultProps;
        _scenes = [[NSMutableDictionary alloc] init];
    }
    return self;
}

- (void)ensureNavigationController
{
    if (!_navigationController) {
        _navigationController = [[NVStackController alloc] init];
        _navigationController.view.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
        _navigationController.navigationBar.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
        [self addSubview:_navigationController.view];
        _navigationController.delegate = self;
    }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [self ensureNavigationController];
    const auto &newViewProps = *std::static_pointer_cast<NVNavigationStackProps const>(props);
    NSMutableArray *keysArr = [[NSMutableArray alloc] init];
    for (auto i = 0; i < newViewProps.keys.size(); i++) {
        NSString *key = [[NSString alloc] initWithUTF8String: newViewProps.keys[i].c_str()];
        [keysArr addObject:key];
    }
    self.keys = [keysArr copy];
    _enterAnimOff = newViewProps.enterAnimOff;
    _mostRecentEventCount = newViewProps.mostRecentEventCount;
    dispatch_async(dispatch_get_main_queue(), ^{
        [self navigate];
    });
    [super updateProps:props oldProps:oldProps];
}

- (void)navigate
{
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    if (eventLag != 0 || _scenes.count == 0)
        return;
    NSInteger crumb = [self.keys count] - 1;
    NSInteger currentCrumb = [_navigationController.viewControllers count] - 1;
    if (crumb < currentCrumb) {
        [_navigationController popToViewController:_navigationController.viewControllers[crumb] animated:true];
    }
    BOOL animate = !self.enterAnimOff;
    if (crumb > currentCrumb) {
        NSMutableArray *controllers = [[NSMutableArray alloc] init];
        for(NSInteger i = 0; i < crumb - currentCrumb; i++) {
            NSInteger nextCrumb = currentCrumb + i + 1;
            NVSceneComponentView *scene = (NVSceneComponentView *) [_scenes objectForKey:[self.keys objectAtIndex:nextCrumb]];
            if (!![scene superview])
                return;
            NVSceneController *controller = [[NVSceneController alloc] initWithScene:scene];
            controller.navigationItem.title = scene.title;
            [controllers addObject:controller];
        }
        
        if (crumb - currentCrumb == 1) {
            [_navigationController pushViewController:controllers[0] animated:animate];
        } else {
            NSArray *allControllers = [_navigationController.viewControllers arrayByAddingObjectsFromArray:controllers];
            [_navigationController setViewControllers:allControllers animated:animate];
        }
    }
    if (crumb == currentCrumb) {
        NVSceneComponentView *scene = (NVSceneComponentView *) [_scenes objectForKey:[self.keys objectAtIndex:crumb]];
        if (!![scene superview])
            return;
        NVSceneController *controller = [[NVSceneController alloc] initWithScene:scene];
        NSMutableArray *controllers = [NSMutableArray arrayWithArray:_navigationController.viewControllers];
        [controllers replaceObjectAtIndex:crumb withObject:controller];
        [_navigationController setViewControllers:controllers animated:animate];
    }
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    UIView *parentView = (UIView *)self.superview;
    while (!self.navigationController.parentViewController && parentView) {
        if (parentView.reactViewController) {
            [parentView.reactViewController addChildViewController:self.navigationController];
        }
        parentView = parentView.superview;
    }
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _navigationController.view.frame = self.bounds;
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    NSInteger crumb = ((NVSceneComponentView *) viewController.view).crumb;
    if (crumb < [self.keys count] - 1) {
        std::static_pointer_cast<NVNavigationStackEventEmitter const>(_eventEmitter)
            ->onWillNavigateBack(NVNavigationStackEventEmitter::OnWillNavigateBack{
                .crumb = static_cast<int>(crumb)
            });
    }
}

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    NSInteger crumb = [navigationController.viewControllers indexOfObject:viewController];
    // [self checkPeekability:crumb];
    if (crumb < [self.keys count] - 1) {
        _nativeEventCount++;
    }
    NSInteger eventCount = crumb < [self.keys count] - 1 ? _nativeEventCount: 0;
    std::static_pointer_cast<NVNavigationStackEventEmitter const>(_eventEmitter)
        ->onRest(NVNavigationStackEventEmitter::OnRest{
            .crumb = static_cast<int>(crumb),
            .eventCount = static_cast<int>(eventCount)
        });

}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _nativeEventCount = 0;
    _scenes = [[NSMutableDictionary alloc] init];
    [_navigationController willMoveToParentViewController:nil];
    [_navigationController.view removeFromSuperview];
    [_navigationController removeFromParentViewController];
    _navigationController = nil;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVNavigationStackComponentDescriptor>();
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    _scenes[((NVSceneComponentView *) childComponentView).sceneKey] = childComponentView;
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [_scenes removeObjectForKey:((NVSceneComponentView *) childComponentView).sceneKey];
    [childComponentView removeFromSuperview];
}

@end

Class<RCTComponentViewProtocol> NVNavigationStackCls(void)
{
  return NVNavigationStackComponentView.class;
}
#endif
