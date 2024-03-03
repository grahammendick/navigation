#import "NVSceneTransitioning.h"

#import <UIKit/UIKit.h>

@implementation NVSceneTransitioning

- (void)animateTransition:(id<UIViewControllerContextTransitioning>)transitionContext
{
    UIView *containerView = [transitionContext containerView];
    UIView *toScene = [transitionContext viewForKey:UITransitionContextToViewKey];
    [containerView addSubview:toScene];
    [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
}

- (NSTimeInterval)transitionDuration:(nullable id<UIViewControllerContextTransitioning>)transitionContext {
    return 0.5;
}

@end
