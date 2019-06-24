#import "NVNavigationBarView.h"

#import <React/UIView+React.h>

@implementation NVNavigationBarView

- (void)didSetProps:(__unused NSArray<NSString *> *)changedProps
{
    [super didSetProps:changedProps];
    [self.reactViewController.navigationController setNavigationBarHidden:self.hidden];
}

- (void)willMoveToSuperview:(nullable UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview) {
        [self.reactViewController.navigationController setNavigationBarHidden:false];
    }
}

@end
