#ifdef RCT_NEW_ARCH_ENABLED
#import "NVNavigationStackComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVNavigationStackComponentView () <RCTNVNavigationStackViewProtocol>
@end

@implementation NVNavigationStackComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVNavigationStackComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVNavigationStackCls(void)
{
  return NVNavigationStackComponentView.class;
}
#endif
