#import "NVNavigationStackView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVNavigationStackView
{
    UINavigationController *_navigationController;
    NSMutableArray *_subviews;
}

- (id)init
{
    if (self = [super init]) {
        _navigationController = [[UINavigationController alloc] init];
        [self addSubview:_navigationController.view];
        _navigationController.delegate = self;
        _subviews = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [_subviews insertObject:subview atIndex:atIndex];
    UIViewController *viewController = [UIViewController new];
    viewController.view = subview;
    [_navigationController pushViewController:viewController animated:YES];
}

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    NSInteger crumb = [navigationController.viewControllers indexOfObject:viewController];
    if (crumb < _subviews.count - 1) {
        self.onNavigateBackIOS(@{@"crumb": @(crumb)});
    }
}

@end
