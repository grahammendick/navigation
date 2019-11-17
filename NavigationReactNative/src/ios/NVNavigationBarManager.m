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
RCT_EXPORT_VIEW_PROPERTY(barTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(titleColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(backTitle, NSString)


@end
