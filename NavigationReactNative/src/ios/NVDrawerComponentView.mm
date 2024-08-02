#ifdef RCT_NEW_ARCH_ENABLED
#import "NVDrawerComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVDrawerComponentView () <RCTNVDrawerViewProtocol>
@end

@implementation NVDrawerComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVDrawerComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVDrawerCls(void)
{
  return NVDrawerComponentView.class;
}

#endif
