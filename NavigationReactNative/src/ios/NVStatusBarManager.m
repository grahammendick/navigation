#import "NVStatusBarView.h"

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

@interface NVStatusBarManager : RCTViewManager

@end

@implementation NVStatusBarManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[NVStatusBarView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(tintStyle, UIStatusBarStyle)
RCT_EXPORT_VIEW_PROPERTY(hidden, BOOL)

@end
