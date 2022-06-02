#import "NVRightBarView.h"
#import <React/RCTViewManager.h>

@interface NVRightBarManager : RCTViewManager
@end

@implementation NVRightBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVRightBarView alloc] init];
}

@end
