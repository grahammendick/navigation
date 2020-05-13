#import "NVTabBarManager.h"
#import "NVTabBarView.h"

@implementation NVTabBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVTabBarView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(tabCount, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(selectedTab, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(barTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(selectedTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(unselectedTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onTabSelected, RCTDirectEventBlock)

@end
