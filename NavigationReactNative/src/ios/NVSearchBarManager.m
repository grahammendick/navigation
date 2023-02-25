#import "NVSearchBarView.h"

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

@interface NVSearchBarManager : RCTViewManager
@end

@implementation NVSearchBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSearchBarView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(obscureBackground, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hideNavigationBar, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hideWhenScrolling, BOOL)
RCT_EXPORT_VIEW_PROPERTY(autoCapitalize, UITextAutocapitalizationType)
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)
RCT_EXPORT_VIEW_PROPERTY(text, NSString)
RCT_EXPORT_VIEW_PROPERTY(active, BOOL)
RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(mostRecentActiveEventCount, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(barTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(scopeButtons, NSArray)
RCT_EXPORT_VIEW_PROPERTY(scopeButton, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(mostRecentButtonEventCount, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onChangeText, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onChangeActive, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onQuery, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onChangeScopeButton, RCTDirectEventBlock)

@end
