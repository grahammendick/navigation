#import "NVSceneManager.h"
#import "NVSceneView.h"

@implementation NVSceneManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSceneView alloc] init];
}

@end
