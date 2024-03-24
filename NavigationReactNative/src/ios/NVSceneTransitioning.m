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
    toSceneController.view.transform = [self transform:_push ? toSceneController.enterTrans : toSceneController.popEnterTrans sceneController:toSceneController bounds:transitionContext.containerView.bounds];
    [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{
        toSceneController.view.transform = CGAffineTransformIdentity;
        toSceneController.view.alpha = 1.0;
        fromSceneController.view.transform = [self transform:self->_push ? fromSceneController.exitTrans : fromSceneController.popExitTrans sceneController:fromSceneController bounds:transitionContext.containerView.bounds];
    } completion:^(BOOL finished) {
        fromSceneController.view.transform = CGAffineTransformIdentity;
        fromSceneController.view.alpha = 1.0;
        [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];
}

- (NSTimeInterval)transitionDuration:(nullable id<UIViewControllerContextTransitioning>)transitionContext {
    return 0.5;
}

- (CGAffineTransform)transform:(NSArray<NVTransition*> *)transitions sceneController:(NVSceneController *)sceneController bounds:(CGRect)bounds
{
    CGAffineTransform transform = CGAffineTransformIdentity;
    for(NSInteger i = 0; i < transitions.count; i++) {
        NVTransition *transition = transitions[i];
        if ([transition.type isEqualToString:@"translate"]) {
            transform = CGAffineTransformTranslate(transform, transition.x.percent ? bounds.size.width * transition.x.val / 100 : transition.x.val, transition.y.percent ? bounds.size.height * transition.y.val / 100 : transition.y.val);
        }
        if ([transition.type isEqualToString:@"scale"]) {
            transform = CGAffineTransformScale(transform, transition.x.val, transition.y.val);
        }
        if ([transition.type isEqualToString:@"rotate"]) {
            transform = CGAffineTransformRotate(transform, transition.x.val * M_PI / 360);
        }
        if ([transition.type isEqualToString:@"alpha"]) {
            sceneController.view.alpha = transition.x.val;
        }
    }
    return transform;
}

@end
