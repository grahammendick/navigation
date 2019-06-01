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
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    UIViewController *viewController = [UIViewController new];
    viewController.view = subview;
    [_navigationController pushViewController:viewController animated:YES];
}

@end
