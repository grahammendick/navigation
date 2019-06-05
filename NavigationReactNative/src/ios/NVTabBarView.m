#import "NVTabBarView.h"
#import "NVNavigationStackView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVTabBarView
{
    UITabBarController *_tabBarController;
}

- (id)init
{
    if (self = [super init]) {
        _tabBarController = [[UITabBarController alloc] init];
        [self addSubview:_tabBarController.view];
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    [_tabBarController addChildViewController:((NVNavigationStackView *) subview).navigationController];
}

- (void)removeReactSubview:(UIView *)subview
{
    NSInteger tab = [self.reactSubviews indexOfObject:subview];
    [super removeReactSubview:subview];
    NSMutableArray *controllers = [NSMutableArray arrayWithArray:[_tabBarController viewControllers]];
    [controllers removeObjectAtIndex:tab];
    [_tabBarController setViewControllers:controllers];
}

- (void)didUpdateReactSubviews
{
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _tabBarController.view.frame = self.bounds;
}

@end
