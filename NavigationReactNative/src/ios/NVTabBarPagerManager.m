#import "NVTabBarPagerManager.h"
#import "NVTabBarPagerView.h"

@implementation NVTabBarPagerManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVTabBarPagerView alloc] init];
}

@end
