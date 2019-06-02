#import "NVNavigationStackManager.h"
#import "NVNavigationStackView.h"

@implementation NVNavigationStackManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVNavigationStackView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(onDidNavigateBack, RCTBubblingEventBlock)

@end
