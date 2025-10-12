#import "NVStackControllerDelegate.h"

#import <UIKit/UIKit.h>


@implementation NVStackControllerDelegate
{
    __weak id<UINavigationControllerDelegate> _stackView;
}

- (id)initWithStackView:(id<UINavigationControllerDelegate>)stackView
{
    if (self = [super init]) {
        _stackView = stackView;
    }
    return self;
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    [_stackView navigationController:navigationController willShowViewController:viewController animated:animated];
}

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    [_stackView navigationController:navigationController didShowViewController:viewController animated:animated];
}

@end


@implementation NVStackControllerTransitionDelegate
{
    __weak id<UINavigationControllerDelegate> _stackView;
}

- (id)initWithStackView:(id<UINavigationControllerDelegate>)stackView
{
    if (self = [super initWithStackView:stackView]) {
        _stackView = stackView;
    }
    return self;
}

- (id<UIViewControllerAnimatedTransitioning>)navigationController:(UINavigationController *)navigationController animationControllerForOperation:(UINavigationControllerOperation)operation fromViewController:(UIViewController *)fromVC toViewController:(UIViewController *)toVC
{
    return [_stackView navigationController:navigationController animationControllerForOperation:operation fromViewController:fromVC toViewController:toVC];
}

- (id<UIViewControllerInteractiveTransitioning>)navigationController:(UINavigationController *)navigationController interactionControllerForAnimationController:(id<UIViewControllerAnimatedTransitioning>)animationController
{
    return [_stackView navigationController:navigationController interactionControllerForAnimationController:animationController];
}

@end
