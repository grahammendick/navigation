#import "NVSegmentedControlManager.h"
#import "NVSegmentedControlView.h"

@implementation NVSegmentedControlManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSegmentedControlView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(titles, NSArray<NSString *>)

@end
