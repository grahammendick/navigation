#import "NVBarTitleView.h"

#import <React/UIView+React.h>

@implementation NVBarTitleView

- (void)didMoveToWindow {
    [super didMoveToWindow];
    
    self.reactViewController.navigationItem.titleView = self;
}

- (void)willMoveToSuperview:(UIView *)newSuperview {
    [super willMoveToSuperview:newSuperview];
    
    if (newSuperview == nil) {
        self.reactViewController.navigationItem.titleView = nil;
    }
}

@end
