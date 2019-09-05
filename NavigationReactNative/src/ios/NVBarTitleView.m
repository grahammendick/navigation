#import "NVBarTitleView.h"

#import <React/UIView+React.h>

@implementation NVBarTitleView

- (void)didMoveToWindow {
    [super didMoveToWindow];
    
    UIViewController *reactViewController = self.reactViewController;
    if (reactViewController && self.window) {
        reactViewController.navigationItem.titleView = self;
    }
}

- (void)willMoveToSuperview:(UIView *)newSuperview {
    [super willMoveToSuperview:newSuperview];
    
    if (newSuperview == nil) {
        self.reactViewController.navigationItem.titleView = nil;
    }
}

@end
