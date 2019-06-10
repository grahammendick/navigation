#import "NVTabBarManager.h"
#import "NVTabBarView.h"

@implementation NVTabBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVTabBarView alloc] init];
}

@end
