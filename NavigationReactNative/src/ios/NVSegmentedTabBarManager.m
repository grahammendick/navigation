#import "NVSegmentedTabBarManager.h"
#import "NVSegmentedTabBarView.h"

@implementation NVSegmentedTabBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSegmentedTabBarView alloc] init];
}

@end
