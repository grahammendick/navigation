#ifdef RCT_NEW_ARCH_ENABLED
#import "NVNavigationStackComponentView.h"
#import "NVSceneComponentView.h"
#import "NVNavigationStackView.h"
#import "NVSceneComponentView.h"
#import "NVSceneController.h"
#import "NVSceneComponentView.h"
#import "NVSceneTransitioning.h"
#import "NVSharedElementComponentView.h"
#import "NVNavigationBarComponentView.h"
#import "NVStackControllerDelegate.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import <React/RCTI18nUtil.h>
#import <React/UIView+React.h>

using namespace facebook::react;

@interface NVNavigationStackComponentView () <RCTNVNavigationStackViewProtocol>
@end

@implementation NVNavigationStackComponentView
{
    NSMutableDictionary *_scenes;
    NSInteger _nativeEventCount;
    NSMutableArray<NVTransition*> *_enterTransitions;
    NSMutableArray<NVTransition*> *_exitTransitions;
    NSString *_sharedElement;
    UIScreenEdgePanGestureRecognizer *_interactiveGestureRecognizer;
    UIPanGestureRecognizer *_interactiveContentGestureRecognizer;
    UIPercentDrivenInteractiveTransition *_interactiveTransition;
    NVStackControllerDelegate *_stackControllerDelegate;
    id<UIGestureRecognizerDelegate> _interactiveGestureRecognizerDelegate;
    BOOL _navigated;
    BOOL _presenting;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVNavigationStackProps>();
        _props = defaultProps;
        _scenes = [[NSMutableDictionary alloc] init];
        _enterTransitions = [[NSMutableArray alloc] init];
        _exitTransitions = [[NSMutableArray alloc] init];
        _navigationController = [[NVStackController alloc] init];
        _navigationController.view.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
        _navigationController.navigationBar.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
        [self addSubview:_navigationController.view];
        _stackControllerDelegate = [[NVStackControllerDelegate alloc] initWithStackView:self];
        _navigationController.delegate = _stackControllerDelegate;
        _interactiveGestureRecognizer = [[UIScreenEdgePanGestureRecognizer alloc] initWithTarget:self action:@selector(handleInteractivePopGesture:)];
        _interactiveGestureRecognizer.delegate = self;
        _interactiveGestureRecognizerDelegate = _navigationController.interactivePopGestureRecognizer.delegate;
        _interactiveGestureRecognizer.edges = ![[RCTI18nUtil sharedInstance] isRTL] ? UIRectEdgeLeft : UIRectEdgeRight;
        _interactiveContentGestureRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(handleInteractivePopGesture:)];
        _interactiveContentGestureRecognizer.delegate = self;
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newViewProps = *std::static_pointer_cast<NVNavigationStackProps const>(props);
    NSMutableArray *keysArr = [[NSMutableArray alloc] init];
    for (auto i = 0; i < newViewProps.keys.size(); i++) {
        NSString *key = [NSString  stringWithUTF8String: newViewProps.keys[i].c_str()];
        [keysArr addObject:key];
    }
    self.keys = [keysArr copy];
    _enterAnimOff = newViewProps.enterAnimOff;
    [_enterTransitions removeAllObjects];
    [_exitTransitions removeAllObjects];
    NSString *durationStr = [NSString  stringWithUTF8String: newViewProps.enterTrans.duration.c_str()];
    int duration = [durationStr length] ? [durationStr intValue] : 350;
    for (auto i = 0; i < newViewProps.enterTrans.items.size(); i++) {
        NVNavigationStackEnterTransItemsStruct transItem = newViewProps.enterTrans.items[i];
        NVTransition *transition = [[NVTransition alloc] initWithType:[NSString  stringWithUTF8String: transItem.type.c_str()]];
        NSString *defaultVal = @"0";
        if ([transition.type isEqualToString:@"scale"] || [transition.type isEqualToString:@"alpha"])
            defaultVal = @"1";
        durationStr = [NSString  stringWithUTF8String: transItem.duration.c_str()];
        transition.duration = [durationStr length] ? [durationStr intValue] : duration;
        transition.x = [self parseAnimation:[NSString  stringWithUTF8String: transItem.fromX.c_str()] defaultVal:defaultVal];
        transition.y = [self parseAnimation:[NSString  stringWithUTF8String: transItem.fromY.c_str()] defaultVal:defaultVal];
        if ([transition.type isEqualToString:@"alpha"] || [transition.type isEqualToString:@"rotate"])
            transition.x = [self parseAnimation:[NSString  stringWithUTF8String: transItem.from.c_str()] defaultVal:defaultVal];
        [_enterTransitions addObject:transition];
    }
    durationStr = [NSString  stringWithUTF8String: newViewProps.exitTrans.duration.c_str()];
    duration = [durationStr length] ? [durationStr intValue] : 350;
    for (auto i = 0; i < newViewProps.exitTrans.items.size(); i++) {
        NVNavigationStackExitTransItemsStruct transItem = newViewProps.exitTrans.items[i];
        NVTransition *transition = [[NVTransition alloc] initWithType:[NSString  stringWithUTF8String: transItem.type.c_str()]];
        NSString *defaultVal = @"0";
        if ([transition.type isEqualToString:@"scale"] || [transition.type isEqualToString:@"alpha"])
            defaultVal = @"1";
        durationStr = [NSString  stringWithUTF8String: transItem.duration.c_str()];
        transition.duration = [durationStr length] ? [durationStr intValue] : duration;
        transition.x = [self parseAnimation:[NSString  stringWithUTF8String: transItem.toX.c_str()] defaultVal:defaultVal];
        transition.y = [self parseAnimation:[NSString  stringWithUTF8String: transItem.toY.c_str()] defaultVal:defaultVal];
        if ([transition.type isEqualToString:@"alpha"] || [transition.type isEqualToString:@"rotate"])
            transition.x = [self parseAnimation:[NSString  stringWithUTF8String: transItem.to.c_str()] defaultVal:defaultVal];
        [_exitTransitions addObject:transition];
    }
    _sharedElement = newViewProps.sharedElements.size() > 0 ? [NSString stringWithUTF8String: newViewProps.sharedElements[0].c_str()] : nil;
    if (newViewProps.customAnimation) {
        if (_navigationController.interactivePopGestureRecognizer.delegate != self) {
            _stackControllerDelegate = [[NVStackControllerTransitionDelegate alloc] initWithStackView:self];
            _navigationController.delegate = _stackControllerDelegate;
            _navigationController.interactivePopGestureRecognizer.delegate = self;
            [_navigationController.view addGestureRecognizer:_interactiveGestureRecognizer];
            if (@available(iOS 26.0, *)) {
                _navigationController.interactiveContentPopGestureRecognizer.delegate = self;
                [_navigationController.view addGestureRecognizer:_interactiveContentGestureRecognizer];
            }
        }
    } else {
        if (_navigationController.interactivePopGestureRecognizer.delegate == self) {
            _stackControllerDelegate = [[NVStackControllerDelegate alloc] initWithStackView:self];
            _navigationController.delegate = _stackControllerDelegate;
            [_navigationController.view removeGestureRecognizer:_interactiveGestureRecognizer];
            [_navigationController.view removeGestureRecognizer:_interactiveContentGestureRecognizer];
            _navigationController.interactivePopGestureRecognizer.delegate = _interactiveGestureRecognizerDelegate;
            if (@available(iOS 26.0, *))
                _navigationController.interactiveContentPopGestureRecognizer.delegate = _interactiveGestureRecognizerDelegate;
        }
    }
    _navigationController.view.backgroundColor = RCTUIColorFromSharedColor(newViewProps.underlayColor);
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

- (NVTransitionValue)parseAnimation:(NSString *)val defaultVal:(NSString *)defaultVal
{
    NVTransitionValue transitionValue;
    val = [val length] ? val : defaultVal;
    if ([val hasSuffix:@"%"]) {
        transitionValue.val = [[val substringToIndex:[val length] -1] floatValue];
        transitionValue.percent = YES;
    } else {
        transitionValue.val = [val floatValue];
        transitionValue.percent = NO;
    }
    return transitionValue;
}

- (void)navigate
{
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    if (eventLag != 0 || _scenes.count == 0)
        return;
    NSInteger crumb = [self.keys count] - 1;
    NSInteger currentCrumb = [_navigationController.viewControllers count] - 1;
    if (crumb < currentCrumb) {
        NVSceneComponentView *scene = (NVSceneComponentView *) [_scenes objectForKey:[self.keys objectAtIndex:crumb]];
        [_navigationController popToViewController:_navigationController.viewControllers[crumb] animated:scene.stacked];
        if (!scene.stacked) currentCrumb = crumb;
    }
    BOOL animate = !self.enterAnimOff && [_navigationController.viewControllers count] > 0;
    if (crumb > currentCrumb) {
        NSMutableArray<NVSceneController*> *controllers = [[NSMutableArray alloc] init];
        NVSceneController *prevSceneController = nil;
        for(NSInteger i = 0; i < crumb - currentCrumb; i++) {
            NSInteger nextCrumb = currentCrumb + i + 1;
            NVSceneComponentView *scene = (NVSceneComponentView *) [_scenes objectForKey:[self.keys objectAtIndex:nextCrumb]];
            if (scene.stacked)
                return;
            scene.stacked = YES;
            NVSceneController *controller = [[NVSceneController alloc] initWithScene:scene];
            controller.navigationItem.title = scene.title;
            controller.enterTrans = _enterTransitions;
            controller.popExitTrans = scene.exitTrans;
            if (!prevSceneController)
                prevSceneController = (NVSceneController *) _navigationController.topViewController;
            if (crumb - currentCrumb == 1 && [self sharedElementView:prevSceneController]) {
                if (@available(iOS 18.0, *)) {
                    [controller setPreferredTransition:[UIViewControllerTransition zoomWithOptions:nil sourceViewProvider:^(UIZoomTransitionSourceViewProviderContext *context) {
                        return [self sharedElementView:prevSceneController];
                    }]];
                }
            }
            prevSceneController.exitTrans = _exitTransitions;
            prevSceneController.popEnterTrans = scene.enterTrans;
            [controllers addObject:controller];
            prevSceneController = controller;
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
        } waitOn:[controllers lastObject]];
        _navigationController.retainedViewController = _navigationController.topViewController;
    }
    if (crumb == currentCrumb) {
        NVSceneComponentView *scene = (NVSceneComponentView *) [_scenes objectForKey:[self.keys objectAtIndex:crumb]];
        if (scene.stacked)
            return;
        scene.stacked = YES;
        NVSceneController *controller = [[NVSceneController alloc] initWithScene:scene];
        controller.enterTrans = _enterTransitions;
        controller.popExitTrans = scene.exitTrans;
        if (_navigationController.viewControllers.count > 1) {
            NVSceneController *prevSceneController = (NVSceneController *) _navigationController.viewControllers[_navigationController.viewControllers.count - 2];
            prevSceneController.exitTrans = _exitTransitions;
            prevSceneController.popEnterTrans = scene.enterTrans;
        }
        NVSceneController *topSceneController = (NVSceneController *) _navigationController.topViewController;
        topSceneController.exitTrans = topSceneController.popExitTrans;
        NSMutableArray *controllers = [NSMutableArray arrayWithArray:_navigationController.viewControllers];
        [controllers replaceObjectAtIndex:crumb withObject:controller];
        __block BOOL completed = NO;
        [self completeNavigation:^{
            if (completed) return;
            completed = YES;
            [self->_navigationController setViewControllers:controllers animated:animate];
        } waitOn:controller];
        _navigationController.retainedViewController = _navigationController.topViewController;
    }
}

- (NVSharedElementComponentView *)sharedElementView:(NVSceneController *)sceneController
{
    if (!_sharedElement || !sceneController) return nil;
    NSSet *sharedElements = sceneController.sharedElements;
    for (NVSharedElementComponentView *sharedElementView in sharedElements) {
        if ([sharedElementView.name isEqual:self->_sharedElement])
            return sharedElementView;
    }
    return nil;
}

-(void)completeNavigation:(void (^)(void)) completeNavigation waitOn:(NVSceneController *)sceneController
{
    UIView<NVNavigationBar> *navigationBar = [sceneController findNavigationBar];
    if (!navigationBar.backImageLoading) {
        completeNavigation();
    } else {
        navigationBar.backImageDidLoadBlock = completeNavigation;
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, .1 * NSEC_PER_SEC), dispatch_get_main_queue(), completeNavigation);
    }
}


- (void)handleInteractivePopGesture:(UIPanGestureRecognizer *)gestureRecognizer
{
    int multiplier = ![[RCTI18nUtil sharedInstance] isRTL] ? 1 : -1;
    float translation = multiplier * [gestureRecognizer translationInView:gestureRecognizer.view].x;
    float width = gestureRecognizer.view.bounds.size.width;
    switch (gestureRecognizer.state) {
        case UIGestureRecognizerStateBegan: {
            _interactiveTransition = [[UIPercentDrivenInteractiveTransition alloc] init];
            [_navigationController popViewControllerAnimated:YES];
            break;
        }
        case UIGestureRecognizerStateChanged: {
            [_interactiveTransition updateInteractiveTransition:translation / width];
            break;
        }
        case UIGestureRecognizerStateCancelled: {
            [_interactiveTransition cancelInteractiveTransition];
            break;
        }
        case UIGestureRecognizerStateEnded: {
            
        }
        default: {
            float velocity = multiplier * [gestureRecognizer velocityInView:gestureRecognizer.view].x;
            if ((translation + velocity * 0.3) > (width / 2)) [_interactiveTransition finishInteractiveTransition];
            else [_interactiveTransition cancelInteractiveTransition];
            _interactiveTransition = nil;
            break;
        }
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
    _presenting = [_navigationController presentedViewController];
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
    if (_presenting) {
        [navigationController dismissViewControllerAnimated:NO completion:nil];
    } else {
        _navigationController.retainedViewController = navigationController.topViewController;
    }
    NSInteger crumb = [navigationController.viewControllers indexOfObject:viewController];
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

- (id<UIViewControllerAnimatedTransitioning>)navigationController:(UINavigationController *)navigationController animationControllerForOperation:(UINavigationControllerOperation)operation fromViewController:(UIViewController *)fromVC toViewController:(UIViewController *)toVC
{
    NVSceneController *fromSceneController = ((NVSceneController *) fromVC);
    NVSceneController *toSceneController = ((NVSceneController *) toVC);
    if (operation == UINavigationControllerOperationPush && toSceneController.enterTrans.count > 0)
        return [[NVSceneTransitioning alloc] initWithDirection:YES];
    if (operation == UINavigationControllerOperationPop && fromSceneController.popExitTrans.count > 0)
        return [[NVSceneTransitioning alloc] initWithDirection:NO];
    return nil;
}

- (id<UIViewControllerInteractiveTransitioning>)navigationController:(UINavigationController *)navigationController interactionControllerForAnimationController:(id<UIViewControllerAnimatedTransitioning>)animationController
{
    return _interactiveTransition;
}

- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer
{
    if (_navigationController.viewControllers.count < 2) return NO;
    NVSceneController *previousSceneController = (NVSceneController *) _navigationController.viewControllers[_navigationController.viewControllers.count - 2];
    if (previousSceneController.view.subviews.count == 0) return NO;
    if (((NVSceneController *) _navigationController.topViewController).popExitTrans.count > 0) {
        if (@available(iOS 26.0, *)) {
            return gestureRecognizer == _interactiveGestureRecognizer || gestureRecognizer == _interactiveContentGestureRecognizer;
        } else {
            return gestureRecognizer == _interactiveGestureRecognizer;
        }
    }
    if (@available(iOS 26.0, *)) {
        return gestureRecognizer == _navigationController.interactivePopGestureRecognizer || gestureRecognizer == _navigationController.interactiveContentPopGestureRecognizer;
    } else {
        return gestureRecognizer == _navigationController.interactivePopGestureRecognizer;
    }
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldBeRequiredToFailByGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
    if ([otherGestureRecognizer.delegate isKindOfClass:[NVNavigationStackComponentView class]]) {
        UIViewController *ancestorController = ((NVNavigationStackComponentView *) otherGestureRecognizer.delegate).navigationController;
        while(ancestorController) {
            ancestorController = ancestorController.parentViewController;
            if (ancestorController == _navigationController)
                return NO;
        }
    }
    return YES;
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

+ (BOOL)shouldBeRecycled
{
  return NO;
}

@end

Class<RCTComponentViewProtocol> NVNavigationStackCls(void)
{
  return NVNavigationStackComponentView.class;
}
#endif
