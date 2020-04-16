#import "NVSegmentedControlManager.h"
#import "NVSegmentedControlView.h"

@implementation NVSegmentedControlManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSegmentedControlView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(titles, NSArray<NSString *>)
RCT_EXPORT_VIEW_PROPERTY(barTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(selectedTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(unselectedTintColor, UIColor)

@end
