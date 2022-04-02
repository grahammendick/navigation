#import "NVNavigationStackViewComponentView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import "NVNavigationStackView.h"

using namespace facebook::react;

@interface NVNavigationStackViewComponentView () <RCTNVNavigationStackViewViewProtocol>
@end

@implementation NVNavigationStackViewComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVNavigationStackViewComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVNavigationStackViewCls(void)
{
  return NVNavigationStackViewComponentView.class;
}
