#import "NVLeftBarManager.h"
#import "NVLeftBarView.h"

@implementation NVLeftBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVLeftBarView alloc] init];
}

@end
