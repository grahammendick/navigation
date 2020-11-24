#import "NVTabBarItemManager.h"
#import "NVTabBarItemView.h"

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>
#import <React/RCTImageSource.h>

 @implementation RCTConvert (UITabBarSystemItem)

 RCT_ENUM_CONVERTER(UITabBarSystemItem, (@{
    @"more": @(UITabBarSystemItemMore),
    @"favorites": @(UITabBarSystemItemFavorites),
    @"featured": @(UITabBarSystemItemFeatured),
    @"top-rated": @(UITabBarSystemItemTopRated),
    @"recents": @(UITabBarSystemItemRecents),
    @"contacts": @(UITabBarSystemItemContacts),
    @"history": @(UITabBarSystemItemHistory),
    @"bookmarks": @(UITabBarSystemItemBookmarks),
    @"search": @(UITabBarSystemItemSearch),
    @"downloads": @(UITabBarSystemItemDownloads),
    @"most-recent": @(UITabBarSystemItemMostRecent),
    @"most-viewed": @(UITabBarSystemItemMostViewed),
    @"": @(NSNotFound)
}), NSNotFound, integerValue)

@end

@implementation NVTabBarItemManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVTabBarItemView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(fontFamily, NSString)
RCT_EXPORT_VIEW_PROPERTY(fontWeight, NSString)
RCT_EXPORT_VIEW_PROPERTY(fontStyle, NSString)
RCT_EXPORT_VIEW_PROPERTY(fontSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(badge, NSString)
RCT_EXPORT_VIEW_PROPERTY(badgeColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(image, RCTImageSource)
RCT_EXPORT_VIEW_PROPERTY(systemItem, UITabBarSystemItem)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(testID, NSString)

@end
