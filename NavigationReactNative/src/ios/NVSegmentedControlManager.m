#import "NVSegmentedControlManager.h"
#import "NVSegmentedControlView.h"

@implementation NVSegmentedControlManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSegmentedControlView alloc] init];
}

@end
