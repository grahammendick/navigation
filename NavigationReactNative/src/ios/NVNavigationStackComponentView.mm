#ifdef RCT_NEW_ARCH_ENABLED
#import "NVNavigationStackComponentView.h"
#import "NVSceneComponentView.h"
#import "NVNavigationStackView.h"
#import "NVSceneComponentView.h"
#import "NVSceneController.h"
#import "NVSceneComponentView.h"
#import "NVNavigationBarComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

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
    UINavigationController *_oldNavigationController;
    BOOL _navigated;
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
        [_oldNavigationController willMoveToParentViewController:nil];
        [_oldNavigationController.view removeFromSuperview];
        [_oldNavigationController removeFromParentViewController];
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
    if (!_navigated) {
        [self navigate];
        _navigated = YES;
    } else {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self navigate];
        });
    }
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
            id __weak weakSelf = self;
            scene.peekableDidChangeBlock = ^{
                [weakSelf checkPeekability:[self.keys count] - 1];
            };
            controller.navigationItem.title = scene.title;
            [controllers addObject:controller];
        }
        __block BOOL completed = NO;
        [self completeNavigation:^{
            if (completed) return;
            completed = YES;
            if (crumb - currentCrumb == 1) {
                [self->_navigationController pushViewController:controllers[0] animated:animate];
            } else {
                NSArray *allControllers = [self->_navigationController.viewControllers arrayByAddingObjectsFromArray:controllers];
                [self->_navigationController setViewControllers:allControllers animated:animate];
            }
        } waitOn:((UIViewController *) [controllers lastObject]).view];
    }
    if (crumb == currentCrumb) {
        NVSceneComponentView *scene = (NVSceneComponentView *) [_scenes objectForKey:[self.keys objectAtIndex:crumb]];
        if (!![scene superview])
            return;
        NVSceneController *controller = [[NVSceneController alloc] initWithScene:scene];
        NSMutableArray *controllers = [NSMutableArray arrayWithArray:_navigationController.viewControllers];
        [controllers replaceObjectAtIndex:crumb withObject:controller];
        __block BOOL completed = NO;
        [self completeNavigation:^{
            if (completed) return;
            completed = YES;
            [self->_navigationController setViewControllers:controllers animated:animate];
        } waitOn:scene];
    }
}

-(void) completeNavigation:(void (^)(void)) completeNavigation waitOn:(UIView *)scene
{
    NVNavigationBarComponentView *navigationBar = [self findNavigationBar:scene];
    if (!navigationBar.backImageLoading) {
        completeNavigation();
    } else {
        navigationBar.backImageDidLoadBlock = completeNavigation;
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, .1 * NSEC_PER_SEC), dispatch_get_main_queue(), completeNavigation);
    }
}

-(NVNavigationBarComponentView *) findNavigationBar:(UIView *)parent
{
    for(NSInteger i = 0; i < parent.subviews.count; i++) {
        UIView* subview = parent.subviews[i];
        if ([subview isKindOfClass:[NVNavigationBarComponentView class]])
            return (NVNavigationBarComponentView *) subview;
        subview = [self findNavigationBar:parent.subviews[i]];
        if ([subview isKindOfClass:[NVNavigationBarComponentView class]])
            return (NVNavigationBarComponentView *) subview;
    }
    return nil;
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
- (void)checkPeekability:(NSInteger)crumb
{
    NVSceneComponentView *scene;
    if (crumb > 1 && self.keys.count > crumb - 1) {
        scene = (NVSceneComponentView *) [_scenes objectForKey:[self.keys objectAtIndex:crumb - 1]];
    }
    _navigationController.interactivePopGestureRecognizer.enabled = scene ? scene.subviews.count > 0 : YES;
}


- (void)layoutSubviews
{
    [super layoutSubviews];
    _navigationController.view.frame = self.bounds;
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    NSInteger crumb = [((NVSceneComponentView *) viewController.view).crumb intValue];
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
    [self checkPeekability:crumb];
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
    _oldNavigationController = _navigationController;
    _navigationController = nil;
    _navigated = NO;
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
