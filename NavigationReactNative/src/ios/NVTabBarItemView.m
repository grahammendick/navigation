#import "NVTabBarItemView.h"
#import "NVNavigationStackView.h"

#import <React/UIView+React.h>

@implementation NVTabBarItemView

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    self.navigationController = [(NVNavigationStackView *) subview navigationController];
}

@end
