#import "NVStatusBarManager.h"
#import "NVStatusBarView.h"

#import <UIKit/UIKit.h>

@implementation NVStatusBarManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[NVStatusBarView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(barStyle, UIStatusBarStyle)

@end
