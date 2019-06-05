#import "NVTabBarItemManager.h"
#import "NVTabBarItemView.h"

@implementation NVTabBarItemManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVTabBarItemView alloc] init];
}

@end
