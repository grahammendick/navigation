#import "NVNavigationStackView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVNavigationStackView
{
    UINavigationController *_navigationController;
}

- (id)init
{
    if (self = [super init]) {
        _navigationController = [[UINavigationController alloc] init];
        [self addSubview:_navigationController.view];
        _navigationController.delegate = self;
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    UIViewController *viewController = [UIViewController new];
    [viewController.view insertSubview:subview atIndex:0];
    [_navigationController pushViewController:viewController animated:YES];
}

- (void)removeReactSubview:(UIView *)subview
{
    NSInteger crumb = [self.reactSubviews indexOfObject:subview] - 1;
    [super removeReactSubview:subview];
    [_navigationController popToViewController:_navigationController.viewControllers[crumb] animated:true];
}

- (void)didUpdateReactSubviews
{
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _navigationController.view.frame = self.bounds;
}

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    NSInteger crumb = [navigationController.viewControllers indexOfObject:viewController];
    if (crumb < [self reactSubviews].count - 1) {
        self.onNavigateBackIOS(@{@"crumb": @(crumb)});
    }
}

@end
