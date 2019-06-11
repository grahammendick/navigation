#import "NVSearchBarManager.h"
#import "NVSearchBarView.h"

#import <UIKit/UIKit.h>

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
RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onChangeText, RCTBubblingEventBlock)

@end
