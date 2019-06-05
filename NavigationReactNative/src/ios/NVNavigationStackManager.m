#import "NVNavigationStackManager.h"
#import "NVNavigationStackView.h"

#import <React/RCTShadowView.h>

@interface NVNavigationStackShadowView : RCTShadowView

@end

@implementation NVNavigationStackShadowView

- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    if ([subview isKindOfClass:[RCTShadowView class]]) {
        ((RCTShadowView *)subview).size = RCTScreenSize();
    }
}

@end

@implementation NVNavigationStackManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVNavigationStackView alloc] init];
}

- (RCTShadowView *)shadowView
{
    return [NVNavigationStackShadowView new];
}

RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onDidNavigateBack, RCTBubblingEventBlock)

@end
