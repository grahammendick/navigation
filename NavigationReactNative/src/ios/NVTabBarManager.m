#import "NVTabBarManager.h"
#import "NVTabBarView.h"

@implementation NVTabBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVTabBarView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(color, UIColor)
RCT_EXPORT_VIEW_PROPERTY(defaultColor, UIColor)

@end
