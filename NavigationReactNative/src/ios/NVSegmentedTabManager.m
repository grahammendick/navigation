#import "NVSegmentedTabManager.h"
#import "NVSegmentedTabView.h"

@implementation NVSegmentedTabManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSegmentedTabView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(selectedTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(unselectedTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(titles, NSArray<NSString *>)
RCT_EXPORT_VIEW_PROPERTY(scrollsToTop, BOOL)

@end
