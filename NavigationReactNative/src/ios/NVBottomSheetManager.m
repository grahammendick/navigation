#import "NVBottomSheetView.h"

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

@interface NVBottomSheetManager : RCTViewManager

@end

@implementation NVBottomSheetManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    if (@available(iOS 15.0, *)) {
        return [[NVBottomSheetView alloc] initWithBridge:self.bridge];
    } else {
        return nil;
    }
}

RCT_EXPORT_VIEW_PROPERTY(detent, NSString)
RCT_EXPORT_VIEW_PROPERTY(peekHeight, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(expandedHeight, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(expandedOffset, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(halfExpandedRatio, double)
RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onDetentChanged, RCTDirectEventBlock)

@end
