#import "NVTabBarManager.h"
#import "NVTabBarView.h"
#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <React/RCTLog.h>

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

RCT_EXPORT_METHOD(hideTabBar:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        NVTabBarView *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[NVTabBarView class]]) {
            RCTLogError(@"Cannot find NVTabBarView with tag #%@", reactTag);
            return;
        }
        [view hideTabBar];
    }];

}

RCT_EXPORT_METHOD(showTabBar:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        NVTabBarView *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[NVTabBarView class]]) {
            RCTLogError(@"Cannot find NVTabBarView with tag #%@", reactTag);
            return;
        }
        [view showTabBar];
    }];

}

@end
