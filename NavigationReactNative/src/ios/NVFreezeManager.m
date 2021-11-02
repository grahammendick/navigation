#import "NVFreezeManager.h"
#import "NVFreezeView.h"

@implementation NVFreezeManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVFreezeView alloc] init];
}

@end
