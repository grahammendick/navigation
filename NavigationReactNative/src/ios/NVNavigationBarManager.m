#import "NVNavigationBarView.h"
#import <React/RCTViewManager.h>

@interface NVNavigationBarManager : RCTViewManager
@end

@implementation NVNavigationBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVNavigationBarView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(crumb, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(isHidden, BOOL)
RCT_EXPORT_VIEW_PROPERTY(largeTitle, BOOL)
RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(titleFontFamily, NSString)
RCT_EXPORT_VIEW_PROPERTY(titleFontWeight, NSString)
RCT_EXPORT_VIEW_PROPERTY(titleFontStyle, NSString)
RCT_EXPORT_VIEW_PROPERTY(titleFontSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(largeTitleFontFamily, NSString)
RCT_EXPORT_VIEW_PROPERTY(largeTitleFontWeight, NSString)
RCT_EXPORT_VIEW_PROPERTY(largeTitleFontStyle, NSString)
RCT_EXPORT_VIEW_PROPERTY(largeTitleFontSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(backFontFamily, NSString)
RCT_EXPORT_VIEW_PROPERTY(backFontWeight, NSString)
RCT_EXPORT_VIEW_PROPERTY(backFontStyle, NSString)
RCT_EXPORT_VIEW_PROPERTY(backFontSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(barTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(largeBarTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(titleColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(largeTitleColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(shadowColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(backTitle, NSString)
RCT_EXPORT_VIEW_PROPERTY(backTitleOn, BOOL)
RCT_EXPORT_VIEW_PROPERTY(backImage, RCTImageSource)
RCT_EXPORT_VIEW_PROPERTY(backTestID, NSString)


@end
