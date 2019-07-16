#import "NVNavigationBarView.h"

#import <React/UIView+React.h>

@implementation NVNavigationBarView

- (id)init
{
    if (self = [super init]) {
        self.tag = NAVIGATION_BAR;
    }
    return self;
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    [super didSetProps:changedProps];
    [self.reactViewController.navigationController setNavigationBarHidden:self.hidden];
    if ([changedProps containsObject:@"title"]) {
        [self.reactViewController.navigationItem setTitle:self.title];
    }
    if ([changedProps containsObject:@"barTintColor"]) {
        [self.reactViewController.navigationController.navigationBar setBarTintColor:self.barTintColor];
    }
    if ([changedProps containsObject:@"tintColor"]) {
        [self.reactViewController.navigationController.navigationBar setTintColor: self.tintColor];
        [self.reactViewController.navigationController.navigationBar setTitleTextAttributes:
            @{NSForegroundColorAttributeName:self.tintColor}];

        if (@available(iOS 11.0, *)) {
            [self.reactViewController.navigationController.navigationBar setLargeTitleTextAttributes:
                @{NSForegroundColorAttributeName:self.tintColor}];
        }
    }
}

- (void)willMoveToSuperview:(nullable UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview) {
        [self.reactViewController.navigationController setNavigationBarHidden:false];
    }
}

@end
