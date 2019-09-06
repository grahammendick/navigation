#import "NVTitleBarViewManager.h"
#import "NVTitleBarView.h"

@implementation NVTitleBarViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[NVTitleBarView alloc] init];
}

@end
