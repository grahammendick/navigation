#import "NVSearchBarManager.h"
#import "NVSearchBarView.h"

#import <UIKit/UIKit.h>
#import <React/RCTShadowView.h>

@interface NVSearchBarShadowView : RCTShadowView

@end

@implementation NVSearchBarShadowView

- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    if ([subview isKindOfClass:[RCTShadowView class]]) {
        ((RCTShadowView *)subview).size = RCTScreenSize();
    }
}

@end

@implementation NVSearchBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSearchBarView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(dimBackground, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hideWhenScrolling, BOOL)
RCT_EXPORT_VIEW_PROPERTY(autoCapitalize, UITextAutocapitalizationType)
RCT_EXPORT_VIEW_PROPERTY(text, NSString)
RCT_EXPORT_VIEW_PROPERTY(onChangeText, RCTBubblingEventBlock)

- (RCTShadowView *)shadowView
{
    return [NVSearchBarShadowView new];
}

@end
