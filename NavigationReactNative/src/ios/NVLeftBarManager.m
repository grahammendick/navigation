#import "NVLeftBarView.h"
#import <React/RCTViewManager.h>

@interface NVLeftBarManager : RCTViewManager
@end

@implementation NVLeftBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVLeftBarView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(supplementBack, BOOL)

@end
