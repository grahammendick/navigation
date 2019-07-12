#import "NVTabBarManager.h"
#import "NVTabBarView.h"

@implementation NVTabBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVTabBarView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(barTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(unselectedTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(isTranslucent, BOOL)

@end
