#import "NVTabBarItemManager.h"
#import "NVTabBarItemView.h"

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@implementation NVTabBarItemManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVTabBarItemView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(image, UIImage)
RCT_EXPORT_VIEW_PROPERTY(systemItem, UITabBarSystemItem)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

@end
