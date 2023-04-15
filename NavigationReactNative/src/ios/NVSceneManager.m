#import "NVSceneView.h"
#import <React/RCTViewManager.h>

@interface NVSceneManager : RCTViewManager
@end

@implementation NVSceneManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSceneView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(sceneKey, NSString)
RCT_EXPORT_VIEW_PROPERTY(crumb, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(hidesTabBar, BOOL)
RCT_EXPORT_VIEW_PROPERTY(landscape, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onPopped, RCTDirectEventBlock)

@end
