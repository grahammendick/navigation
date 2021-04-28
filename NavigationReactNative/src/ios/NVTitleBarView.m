#import "NVTitleBarView.h"

#import <React/UIView+React.h>
#import <React/RCTUIManager.h>

@implementation NVTitleBarView
{
    __weak RCTBridge *_bridge;
    CGRect _lastViewFrame;
}

- (id)initWithBridge:(RCTBridge *)bridge
{
    if (self = [super initWithFrame:CGRectZero]) {
        _bridge = bridge;
    }
    return self;
}

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

- (void)layoutSubviews {
    [super layoutSubviews];
    if (!CGRectEqualToRect(_lastViewFrame, self.frame)) {
        [_bridge.uiManager setSize:self.frame.size forView:self];
        _lastViewFrame = self.frame;
    }
}

@end
