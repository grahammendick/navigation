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

@end
