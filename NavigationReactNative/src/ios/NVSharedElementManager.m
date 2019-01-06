#import "NVSharedElementManager.h"
#import "NVSharedElementView.h"

@implementation NVSharedElementManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSharedElementView alloc] init];
}

@end
