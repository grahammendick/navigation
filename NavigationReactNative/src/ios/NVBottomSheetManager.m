#import "NVBottomSheetView.h"

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

@interface NVBottomSheetManager : RCTViewManager

@end

@implementation NVBottomSheetManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[NVBottomSheetView alloc] initWithBridge:self.bridge];
}

@end
