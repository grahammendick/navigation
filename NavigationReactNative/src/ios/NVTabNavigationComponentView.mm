#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTabNavigationComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVTabNavigationComponentView () <RCTNVTabNavigationViewProtocol>
@end

@implementation NVTabNavigationComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVTabNavigationComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVTabNavigationCls(void)
{
  return NVTabNavigationComponentView.class;
}

#endif
