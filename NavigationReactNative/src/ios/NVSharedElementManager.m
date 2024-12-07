#import "NVSharedElementView.h"
#import <React/RCTViewManager.h>

@interface NVSharedElementManager : RCTViewManager
@end

@implementation NVSharedElementManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSharedElementView alloc] init];
}

@end
