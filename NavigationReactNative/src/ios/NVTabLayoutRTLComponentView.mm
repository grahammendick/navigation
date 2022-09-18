#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTabLayoutRTLComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVTabLayoutRTLComponentView () <RCTNVTabLayoutRTLViewProtocol>
@end

@implementation NVTabLayoutRTLComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVTabLayoutRTLComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVTabLayoutRTLCls(void)
{
  return NVTabLayoutRTLComponentView.class;
}

#endif
