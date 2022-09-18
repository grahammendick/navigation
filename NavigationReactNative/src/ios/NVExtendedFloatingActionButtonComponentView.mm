#ifdef RCT_NEW_ARCH_ENABLED
#import "NVExtendedFloatingActionButtonComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVExtendedFloatingActionButtonComponentView () <RCTNVExtendedFloatingActionButtonViewProtocol>
@end

@implementation NVExtendedFloatingActionButtonComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVExtendedFloatingActionButtonComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVExtendedFloatingActionButtonCls(void)
{
  return NVExtendedFloatingActionButtonComponentView.class;
}

#endif
