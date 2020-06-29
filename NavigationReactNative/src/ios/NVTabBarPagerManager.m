#import "NVTabBarPagerManager.h"
#import "NVTabBarPagerView.h"

@implementation NVTabBarPagerManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVTabBarPagerView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(tabCount, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(selectedTab, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(scrollsToTop, BOOL)
RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onTabSelected, RCTDirectEventBlock)

@end
