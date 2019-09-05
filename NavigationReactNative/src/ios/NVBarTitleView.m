#import "NVBarTitleView.h"

#import <React/RCTUIManager.h>
#import <React/UIView+React.h>

@interface NVBarTitleView ()

@property (nonatomic, weak) RCTBridge *bridge;

@end

@implementation NVBarTitleView

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    if (self = [super init]) {
        self.bridge = bridge;
    }
    return self;
}

- (void)setFrame:(CGRect)frame {
    BOOL frameUpdated = !CGRectEqualToRect(self.frame, frame);
    [super setFrame:frame];
    
    if (self.reactTag && frameUpdated) {
        [self.bridge.uiManager setSize:self.bounds.size forView:self];
    }
}

- (void)didMoveToWindow {
    [super didMoveToWindow];
    
    UIViewController *reactViewController = self.reactViewController;
    if (reactViewController && self.window) {
        reactViewController.navigationItem.titleView = self;
    }
}

@end
