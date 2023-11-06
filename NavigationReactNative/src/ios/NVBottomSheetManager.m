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

RCT_EXPORT_VIEW_PROPERTY(detent, NSString)
RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onDetentChanged, RCTDirectEventBlock)

@end
