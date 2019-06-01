#import "NVNavigationStackManager.h"
#import "NVNavigationStackView.h"

@implementation NVNavigationStackManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVNavigationStackView alloc] init];
}

@end
