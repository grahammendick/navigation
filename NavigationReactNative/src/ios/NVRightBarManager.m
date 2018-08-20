#import "NVRightBarManager.h"
#import "NVRightBarView.h"

@implementation NVRightBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVRightBarView alloc] init];
}

@end
