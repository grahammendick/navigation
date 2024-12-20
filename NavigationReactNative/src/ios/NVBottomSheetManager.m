#import "NVBottomSheetView.h"

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import <React/RCTInvalidating.h>

@interface NVBottomSheetManager : RCTViewManager

@end

@implementation NVBottomSheetManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[NVBottomSheetView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(detent, NSString)
RCT_EXPORT_VIEW_PROPERTY(modal, BOOL)
RCT_EXPORT_VIEW_PROPERTY(fullScreen, BOOL)
RCT_EXPORT_VIEW_PROPERTY(root, BOOL)
RCT_EXPORT_VIEW_PROPERTY(dismissed, BOOL)
RCT_EXPORT_VIEW_PROPERTY(peekHeight, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(expandedHeight, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(expandedOffset, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(halfExpandedRatio, double)
RCT_EXPORT_VIEW_PROPERTY(hideable, BOOL)
RCT_EXPORT_VIEW_PROPERTY(draggable, BOOL)
RCT_EXPORT_VIEW_PROPERTY(skipCollapsed, BOOL)
RCT_EXPORT_VIEW_PROPERTY(sharedElement, NSString)
RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onDetentChanged, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDismissed, RCTDirectEventBlock)

@end
