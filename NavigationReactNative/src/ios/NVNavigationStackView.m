#import "NVNavigationStackView.h"
#import "NVSceneView.h"
#import "NVSceneController.h"
#import "NVSceneTransitioning.h"
#import "NVSharedElementView.h"
#import "NVNavigationBarView.h"
#import "NVStackControllerDelegate.h"

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTI18nUtil.h>
#import <React/RCTUIManager.h>
#import <React/RCTUtils.h>
#import <React/UIView+React.h>

@implementation NVNavigationStackView
{
    __weak RCTBridge *_bridge;
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

- (id)initWithBridge:(RCTBridge *)bridge
{
    if (self = [super init]) {
        _bridge = bridge;
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
        _scenes = [[NSMutableDictionary alloc] init];
        _enterTransitions = [[NSMutableArray alloc] init];
        _exitTransitions = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    _scenes[((NVSceneView *) subview).sceneKey] = subview;
}

- (void)removeReactSubview:(UIView *)subview
{
    [super removeReactSubview:subview];
    [_scenes removeObjectForKey:((NVSceneView *) subview).sceneKey];
}

- (void)didUpdateReactSubviews
{
}

- (void)setSharedElements:(NSArray *)sharedElements
{
    _sharedElement = [sharedElements objectAtIndex:0];
}

- (void)setCustomAnimation:(BOOL)customAnimation
{
    if (customAnimation) {
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
}

- (void)setUnderlayColor:(UIColor *)underlayColor
{
    _navigationController.view.backgroundColor = underlayColor;
}

- (void)setEnterTrans:(NSDictionary *)enterTrans
{
    [_enterTransitions removeAllObjects];
    NSString *durationStr = enterTrans[@"duration"];
    int duration = [durationStr length] ? [durationStr intValue] : 350;
    for (int i = 0; i < ((NSArray<NSDictionary *> *) enterTrans[@"items"]).count; i++) {
        NSDictionary *transItem = ((NSArray<NSDictionary *> *) enterTrans[@"items"])[i];
        NVTransition *transition = [[NVTransition alloc] initWithType:transItem[@"type"]];
        NSString *defaultVal = @"0";
        if ([transition.type isEqualToString:@"scale"] || [transition.type isEqualToString:@"alpha"])
            defaultVal = @"1";
        durationStr = transItem[@"duration"];
        transition.duration = [durationStr length] ? [durationStr intValue] : duration;
        transition.x = [self parseAnimation:transItem[@"fromX"] defaultVal:defaultVal];
        transition.y = [self parseAnimation:transItem[@"fromY"] defaultVal:defaultVal];
        if ([transition.type isEqualToString:@"alpha"] || [transition.type isEqualToString:@"rotate"])
            transition.x = [self parseAnimation:transItem[@"from"] defaultVal:defaultVal];
        [_enterTransitions addObject:transition];
    }
}

- (void)setExitTrans:(NSDictionary *)exitTrans
{
    [_exitTransitions removeAllObjects];
    NSString *durationStr = exitTrans[@"duration"];
    int duration = [durationStr length] ? [durationStr intValue] : 350;
    for (int i = 0; i < ((NSArray<NSDictionary *> *) exitTrans[@"items"]).count; i++) {
        NSDictionary *transItem = ((NSArray<NSDictionary *> *) exitTrans[@"items"])[i];
        NVTransition *transition = [[NVTransition alloc] initWithType:transItem[@"type"]];
        NSString *defaultVal = @"0";
        if ([transition.type isEqualToString:@"scale"] || [transition.type isEqualToString:@"alpha"])
            defaultVal = @"1";
        durationStr = transItem[@"duration"];
        transition.duration = [durationStr length] ? [durationStr intValue] : duration;
        transition.x = [self parseAnimation:transItem[@"toX"] defaultVal:defaultVal];
        transition.y = [self parseAnimation:transItem[@"toY"] defaultVal:defaultVal];
        if ([transition.type isEqualToString:@"alpha"] || [transition.type isEqualToString:@"rotate"])
            transition.x = [self parseAnimation:transItem[@"to"] defaultVal:defaultVal];
        [_exitTransitions addObject:transition];
    }
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

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    [super didSetProps:changedProps];
    if (!_navigated) {
        [self navigate];
        _navigated = YES;
    } else {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self navigate];
        });
    }
}

- (void)navigate
{
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    if (eventLag != 0 || _scenes.count == 0)
        return;
    NSInteger crumb = [self.keys count] - 1;
    NSInteger currentCrumb = [_navigationController.viewControllers count] - 1;
    if (crumb < currentCrumb) {
        NVSceneView *scene = (NVSceneView *) [_scenes objectForKey:[self.keys objectAtIndex:crumb]];
        [_navigationController popToViewController:_navigationController.viewControllers[crumb] animated:scene.stacked];
        if (!scene.stacked) currentCrumb = crumb;
    }
    BOOL animate = ![self.enterAnim isEqualToString:@""] && [_navigationController.viewControllers count] > 0;
    if (crumb > currentCrumb) {
        NSMutableArray<NVSceneController*> *controllers = [[NSMutableArray alloc] init];
        NVSceneController *prevSceneController = nil;
        for(NSInteger i = 0; i < crumb - currentCrumb; i++) {
            NSInteger nextCrumb = currentCrumb + i + 1;
            NVSceneView *scene = (NVSceneView *) [_scenes objectForKey:[self.keys objectAtIndex:nextCrumb]];
            if (scene.stacked)
                return;
            scene.stacked = YES;
            NVSceneController *controller = [[NVSceneController alloc] initWithScene:scene];
            __weak typeof(self) weakSelf = self;
            controller.boundsDidChangeBlock = ^(NVSceneController *sceneController) {
                [weakSelf notifyForBoundsChange:sceneController];
            };
            controller.navigationItem.title = scene.title;
            controller.enterTrans = _enterTransitions;
            controller.popExitTrans = scene.exitTransArray;
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
            prevSceneController.popEnterTrans = scene.enterTransArray;
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
        NVSceneView *scene = (NVSceneView *) [_scenes objectForKey:[self.keys objectAtIndex:crumb]];
        if (scene.stacked)
            return;
        scene.stacked = YES;
        NVSceneController *controller = [[NVSceneController alloc] initWithScene:scene];
        controller.enterTrans = _enterTransitions;
        controller.popExitTrans = scene.exitTransArray;
        if (_navigationController.viewControllers.count > 1) {
            NVSceneController *prevSceneController = (NVSceneController *) _navigationController.viewControllers[_navigationController.viewControllers.count - 2];
            prevSceneController.exitTrans = _exitTransitions;
            prevSceneController.popEnterTrans = scene.enterTransArray;
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

- (NVSharedElementView *)sharedElementView:(NVSceneController *)sceneController
{
    if (!_sharedElement || !sceneController) return nil;
    NSSet *sharedElements = sceneController.sharedElements;
    for (NVSharedElementView *sharedElementView in sharedElements) {
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

- (void)notifyForBoundsChange:(NVSceneController *)controller
{
    [_bridge.uiManager setSize:controller.view.bounds.size forView:controller.view];
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _navigationController.view.frame = self.bounds;
}

- (void)dealloc
{
    _navigationController.delegate = nil;
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    _presenting = [_navigationController presentedViewController];
    NSInteger crumb = [((NVSceneView *) viewController.view).crumb intValue];
    if (crumb < [self.keys count] - 1) {
        self.onWillNavigateBack(@{ @"crumb": @(crumb) });
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
    self.onRest(@{
        @"crumb": @(crumb),
        @"eventCount": crumb < [self.keys count] - 1 ? @(_nativeEventCount) : @0
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
    if ([otherGestureRecognizer.delegate isKindOfClass:[NVNavigationStackView class]]) {
        UIViewController *ancestorController = ((NVNavigationStackView *) otherGestureRecognizer.delegate).navigationController;
        while(ancestorController) {
            ancestorController = ancestorController.parentViewController;
            if (ancestorController == _navigationController)
                return NO;
        }
    }
    return YES;
}

@end

@implementation NVStackController
{
    BOOL _dismissing;
}

- (UIViewController *)childViewControllerForStatusBarStyle
{
    return self.visibleViewController;
}

- (UIViewController *)childViewControllerForStatusBarHidden
{
    return self.visibleViewController;
}

- (BOOL)navigationBar:(UINavigationBar *)navigationBar shouldPopItem:(UINavigationItem *)item
{
    NVSceneView *scene;
    NSInteger crumb = [[navigationBar items] indexOfObject:item];
    if (self.viewControllers.count > crumb - 1)
        scene = ((NVSceneView *) [self.viewControllers objectAtIndex:crumb - 1].view);
    return scene ? scene.subviews.count > 0 : YES;
}

- (void)dismissViewControllerAnimated:(BOOL)flag completion:(void (^)(void))completion
{
    BOOL dismissing = NO;
    if (!_dismissing) {
        _dismissing = YES;
        dismissing = YES;
    }
    [super dismissViewControllerAnimated:flag completion:^{
        self->_dismissing = NO;
        if (dismissing) {
            self->_retainedViewController = self.topViewController;
        }
        if (completion) {
            completion();
        }
    }];
}

@end

@implementation UIViewController (Navigation)

- (UIViewController *)navigation_childViewControllerForStatusBarStyle
{
    return [self childViewControllerForStatusBar];
}

- (UIViewController *)navigation_childViewControllerForStatusBarHidden
{
    return [self childViewControllerForStatusBar];
}

- (UIViewController *)childViewControllerForStatusBar
{
    UIViewController *viewController = [[self childViewControllers] lastObject];
    return ([viewController isKindOfClass:[UINavigationController class]] || [viewController isKindOfClass:[UITabBarController class]]) ? viewController : nil;
}

+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        RCTSwapInstanceMethods([UIViewController class], @selector(childViewControllerForStatusBarStyle), @selector(navigation_childViewControllerForStatusBarStyle));
        RCTSwapInstanceMethods([UIViewController class], @selector(childViewControllerForStatusBarHidden), @selector(navigation_childViewControllerForStatusBarHidden));
    });
}

@end
