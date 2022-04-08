#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSceneComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVSceneComponentView () <RCTNVSceneViewProtocol>
@end

@implementation NVSceneComponentView

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
  return NVSceneComponentView.class;
}
#endif
