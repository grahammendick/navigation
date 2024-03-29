#import "NVSegmentedTabView.h"
#import <React/RCTViewManager.h>

@interface NVSegmentedTabManager : RCTViewManager
@end

@implementation NVSegmentedTabManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSegmentedTabView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(selectedTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(unselectedTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(tabs, NSArray<NSDictionary *>)
RCT_EXPORT_VIEW_PROPERTY(titles, NSArray<NSString *>)
RCT_EXPORT_VIEW_PROPERTY(testIDs, NSArray<NSString *>)
RCT_EXPORT_VIEW_PROPERTY(fontFamily, NSString)
RCT_EXPORT_VIEW_PROPERTY(fontWeight, NSString)
RCT_EXPORT_VIEW_PROPERTY(fontStyle, NSString)
RCT_EXPORT_VIEW_PROPERTY(fontSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(scrollsToTop, BOOL)

@end
