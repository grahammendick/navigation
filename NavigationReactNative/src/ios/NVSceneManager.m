#import "NVSceneManager.h"
#import "NVSceneView.h"

@implementation NVSceneManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSceneView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(onWillAppear, RCTBubblingEventBlock)

@end
