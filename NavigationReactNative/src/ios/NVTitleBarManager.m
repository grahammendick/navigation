#import "NVTitleBarView.h"
#import <React/RCTViewManager.h>

@interface NVTitleBarManager : RCTViewManager

@end

@implementation NVTitleBarManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[NVTitleBarView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(onChangeBounds, RCTDirectEventBlock)

@end
