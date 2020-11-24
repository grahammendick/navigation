#import "NVNavigationBarManager.h"
#import "NVNavigationBarView.h"

@implementation NVNavigationBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVNavigationBarView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(hidden, BOOL)
RCT_EXPORT_VIEW_PROPERTY(largeTitle, BOOL)
RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(titleFontFamily, NSString)
RCT_EXPORT_VIEW_PROPERTY(titleFontWeight, NSString)
RCT_EXPORT_VIEW_PROPERTY(titleFontStyle, NSString)
RCT_EXPORT_VIEW_PROPERTY(titleFontSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(backFontFamily, NSString)
RCT_EXPORT_VIEW_PROPERTY(backFontWeight, NSString)
RCT_EXPORT_VIEW_PROPERTY(backFontStyle, NSString)
RCT_EXPORT_VIEW_PROPERTY(backFontSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(barTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(titleColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(backTitle, NSString)
RCT_EXPORT_VIEW_PROPERTY(backTestID, NSString)


@end
