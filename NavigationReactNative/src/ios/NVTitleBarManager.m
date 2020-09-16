#import "NVTitleBarManager.h"
#import "NVTitleBarView.h"

@implementation NVTitleBarManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[NVTitleBarView alloc] init];
}

@end
