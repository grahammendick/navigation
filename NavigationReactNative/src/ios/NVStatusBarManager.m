#import "NVStatusBarManager.h"
#import "NVStatusBarView.h"

@implementation NVStatusBarManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[NVStatusBarView alloc] init];
}

@end
