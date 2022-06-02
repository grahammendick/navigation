#ifdef RCT_NEW_ARCH_ENABLED
#import "NVFloatingActionButtonComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVFloatingActionButtonComponentView () <RCTNVFloatingActionButtonViewProtocol>
@end

@implementation NVFloatingActionButtonComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVFloatingActionButtonComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVFloatingActionButtonCls(void)
{
  return NVFloatingActionButtonComponentView.class;
}

#endif
