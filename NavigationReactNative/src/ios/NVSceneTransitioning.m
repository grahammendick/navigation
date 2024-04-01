#import "NVSceneTransitioning.h"
#import "NVSceneController.h"

#import <UIKit/UIKit.h>

@implementation NVSceneTransitioning
{
    BOOL _push;
}

- (id)initWithDirection:(BOOL)push;
{
    if (self = [super init]) {
        _push = push;
    }
    return self;
}

- (void)animateTransition:(id<UIViewControllerContextTransitioning>)transitionContext
{
    UIView *containerView = [transitionContext containerView];
    UIView *toScene = [transitionContext viewForKey:UITransitionContextToViewKey];
    UIView *fromScene = [transitionContext viewForKey:UITransitionContextFromViewKey];
    NVSceneController *toSceneController = [transitionContext
                viewControllerForKey:UITransitionContextToViewControllerKey];
    NVSceneController *fromSceneController = [transitionContext
                viewControllerForKey:UITransitionContextFromViewControllerKey];
    if (_push)
        [containerView addSubview:toScene];
    else
        [containerView insertSubview:toScene belowSubview:fromScene];
    [self transform:_push ? toSceneController.enterTrans : toSceneController.popEnterTrans sceneController:toSceneController bounds:transitionContext.containerView.bounds];
    NSTimeInterval toDuration = [self transitionDuration:toSceneController enter:YES];
    NSTimeInterval fromDuration = [self transitionDuration:fromSceneController enter:NO];
    [UIView animateWithDuration:toDuration animations:^{
        toSceneController.view.transform = CGAffineTransformIdentity;
        toSceneController.view.alpha = 1.0;
    } completion:^(BOOL finished) {
        if (toDuration >= fromDuration) {
            toSceneController.view.transform = CGAffineTransformIdentity;
            fromSceneController.view.transform = CGAffineTransformIdentity;
            fromSceneController.view.alpha = 1.0;
            [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }
    }];
    [UIView animateWithDuration:fromDuration animations:^{
        [self transform:self->_push ? fromSceneController.exitTrans : fromSceneController.popExitTrans sceneController:fromSceneController bounds:transitionContext.containerView.bounds];
    } completion:^(BOOL finished) {
        if (fromDuration > toDuration) {
            toSceneController.view.transform = CGAffineTransformIdentity;
            fromSceneController.view.transform = CGAffineTransformIdentity;
            fromSceneController.view.alpha = 1.0;
            [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }
    }];
}

- (NSTimeInterval)transitionDuration:(nullable id<UIViewControllerContextTransitioning>)transitionContext {
    NVSceneController *toSceneController = [transitionContext
                viewControllerForKey:UITransitionContextToViewControllerKey];
    NVSceneController *fromSceneController = [transitionContext
                viewControllerForKey:UITransitionContextFromViewControllerKey];
    return MAX([self transitionDuration:toSceneController enter:YES], [self transitionDuration:fromSceneController enter:NO]);
}

- (NSTimeInterval)transitionDuration:(NVSceneController *) sceneController enter:(BOOL)enter
{
    NSArray<NVTransition*> *transitions;
    if (enter) {
        transitions = _push ? sceneController.enterTrans : sceneController.popEnterTrans;
    } else {
        transitions = _push ? sceneController.exitTrans : sceneController.popExitTrans;
    }
    float duration = 0;
    for(NSInteger i = 0; i < transitions.count; i++) {
        duration = MAX(duration, transitions[i].duration);
    }
    return duration / 1000;
}

- (void)transform:(NSArray<NVTransition*> *)transitions sceneController:(NVSceneController *)sceneController bounds:(CGRect)bounds
{
    CGAffineTransform transform = CGAffineTransformIdentity;
    for(NSInteger i = 0; i < transitions.count; i++) {
        NVTransition *transition = transitions[i];
        if ([transition.type isEqualToString:@"translate"]) {
            transform = CGAffineTransformTranslate(transform, transition.x.percent ? bounds.size.width * transition.x.val / 100 : transition.x.val, transition.y.percent ? bounds.size.height * transition.y.val / 100 : transition.y.val);
        }
        if ([transition.type isEqualToString:@"scale"]) {
            transform = CGAffineTransformScale(transform, transition.x.percent ? transition.x.val / 100 : transition.x.val, transition.y.percent ? transition.y.val / 100 : transition.y.val);
        }
        if ([transition.type isEqualToString:@"rotate"]) {
            transform = CGAffineTransformRotate(transform, transition.x.val * M_PI / 360);
        }
        if ([transition.type isEqualToString:@"alpha"]) {
            sceneController.view.alpha = transition.x.val;
        }
    }
    sceneController.view.transform = transform;
}

@end
