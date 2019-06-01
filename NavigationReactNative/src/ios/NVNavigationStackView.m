#import "NVNavigationStackView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVNavigationStackView
{
    UINavigationController *_navigationController;
    NSMutableArray *subviews;
}

- (id)init
{
    if (self = [super init]) {
        _navigationController = [[UINavigationController alloc] init];
        [self addSubview:_navigationController.view];
        subviews = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    //[super insertReactSubview:subview atIndex:atIndex];
    [subviews insertObject:subview atIndex:atIndex];
    UIViewController *viewController = [UIViewController new];
    viewController.view = subview;
    [_navigationController pushViewController:viewController animated:YES];
}

@end
