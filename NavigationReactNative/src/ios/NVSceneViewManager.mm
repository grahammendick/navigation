#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import "NVSceneView.h"

using namespace facebook::react;

NS_ASSUME_NONNULL_BEGIN

@interface NVSceneViewManager : RCTViewComponentView

@end

NS_ASSUME_NONNULL_END


@interface NVSceneViewManager () <RCTNVSceneViewProtocol>
@end

@implementation NVSceneViewManager

- (instancetype)initWithFrame:(CGRect)frame
{
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVSceneComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVSceneCls(void)
{
  return NVSceneViewManager.class;
}
#endif
