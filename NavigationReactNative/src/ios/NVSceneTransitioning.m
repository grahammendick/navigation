#import "NVSceneTransitioning.h"
#import "NVSceneController.h"

#import <UIKit/UIKit.h>

@implementation NVSceneTransitioning

- (void)animateTransition:(id<UIViewControllerContextTransitioning>)transitionContext
{
    UIView *containerView = [transitionContext containerView];
    UIView *toScene = [transitionContext viewForKey:UITransitionContextToViewKey];
    NVSceneController *toSceneController = [transitionContext
                viewControllerForKey:UITransitionContextToViewControllerKey];
    NVSceneController *fromSceneController = [transitionContext
                viewControllerForKey:UITransitionContextFromViewControllerKey];
    [containerView addSubview:toScene];
    toSceneController.view.transform = [self transform:toSceneController.enterTrans sceneController:toSceneController bounds:transitionContext.containerView.bounds];
    [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{
        toSceneController.view.transform = CGAffineTransformIdentity;
        toSceneController.view.alpha = 1.0;
        fromSceneController.view.transform = [self transform:fromSceneController.exitTrans sceneController:fromSceneController bounds:transitionContext.containerView.bounds];
    } completion:^(BOOL finished) {
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
