#import "NVStackControllerDelegate.h"

#import <UIKit/UIKit.h>


@implementation NVStackControllerDelegate
{
    __weak id<UINavigationControllerDelegate> _del;
}

- (id)initWithDel:(id<UINavigationControllerDelegate>)del
{
    if (self = [super init]) {
        _del = del;
    }
    return self;
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    [_del navigationController:navigationController willShowViewController:viewController animated:animated];
}

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    [_del navigationController:navigationController didShowViewController:viewController animated:animated];
}

@end


@implementation NVStackControllerTransitionDelegate
{
    __weak id<UINavigationControllerDelegate> _del;
}

- (id)initWithDel:(id<UINavigationControllerDelegate>)del
{
    if (self = [super init]) {
        _del = del;
    }
    return self;
}

- (id<UIViewControllerAnimatedTransitioning>)navigationController:(UINavigationController *)navigationController animationControllerForOperation:(UINavigationControllerOperation)operation fromViewController:(UIViewController *)fromVC toViewController:(UIViewController *)toVC
{
    return [_del navigationController:navigationController animationControllerForOperation:operation fromViewController:fromVC toViewController:toVC];
}

- (id<UIViewControllerInteractiveTransitioning>)navigationController:(UINavigationController *)navigationController interactionControllerForAnimationController:(id<UIViewControllerAnimatedTransitioning>)animationController
{
    return [_del navigationController:navigationController interactionControllerForAnimationController:animationController];
}

@end
