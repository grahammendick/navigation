#ifdef RCT_NEW_ARCH_ENABLED
#import "NVDrawerLayoutComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVDrawerLayoutComponentView () <RCTNVDrawerLayoutViewProtocol>
@end

@implementation NVDrawerLayoutComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVDrawerLayoutComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVDrawerLayoutCls(void)
{
  return NVDrawerLayoutComponentView.class;
}

#endif
