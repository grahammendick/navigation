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
    [containerView addSubview:toScene];
    CGAffineTransform transform = CGAffineTransformIdentity;
    for(NSInteger i = 0; i < toSceneController.enterTrans.count; i++) {
        NVTransition *transition = toSceneController.enterTrans[i];
        if ([transition.type isEqualToString:@"translate"]) {
            transform = CGAffineTransformTranslate(transform, transition.x.percent ? transitionContext.containerView.bounds.size.width * transition.x.val / 100 : transition.x.val, transition.y.percent ? transitionContext.containerView.bounds.size.height * transition.y.val / 100 : transition.y.val);
        }
        if ([transition.type isEqualToString:@"scale"]) {
            transform = CGAffineTransformScale(transform, transition.x.val, transition.y.val);
        }
        if ([transition.type isEqualToString:@"rotate"]) {
            transform = CGAffineTransformRotate(transform, transition.x.val * M_PI / 360);
        }
        if ([transition.type isEqualToString:@"alpha"]) {
            toSceneController.view.alpha = transition.x.val;
        }
    }
    toSceneController.view.transform = transform;
    [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{
        toSceneController.view.transform = CGAffineTransformIdentity;
        toSceneController.view.alpha = 1.0;
    } completion:^(BOOL finished) {
        [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];
}

- (NSTimeInterval)transitionDuration:(nullable id<UIViewControllerContextTransitioning>)transitionContext {
    return 0.5;
}

@end
