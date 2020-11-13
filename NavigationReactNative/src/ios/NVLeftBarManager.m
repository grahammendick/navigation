#import "NVLeftBarManager.h"
#import "NVLeftBarView.h"

@implementation NVLeftBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVLeftBarView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(supplementBack, BOOL)

@end
