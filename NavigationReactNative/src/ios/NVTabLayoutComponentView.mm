#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTabLayoutComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVTabLayoutComponentView () <RCTNVTabLayoutViewProtocol>
@end

@implementation NVTabLayoutComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVTabLayoutComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVTabLayoutCls(void)
{
  return NVTabLayoutComponentView.class;
}

#endif
