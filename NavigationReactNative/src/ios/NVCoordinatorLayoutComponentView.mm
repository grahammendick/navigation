#ifdef RCT_NEW_ARCH_ENABLED
#import "NVCoordinatorLayoutComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVCoordinatorLayoutComponentView () <RCTNVCoordinatorLayoutViewProtocol>
@end

@implementation NVCoordinatorLayoutComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVCoordinatorLayoutComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVCoordinatorLayoutCls(void)
{
  return NVCoordinatorLayoutComponentView.class;
}

#endif
