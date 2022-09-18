#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTabBarPagerRTLComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVTabBarPagerRTLComponentView () <RCTNVTabBarPagerRTLViewProtocol>
@end

@implementation NVTabBarPagerRTLComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVTabBarPagerRTLComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVTabBarPagerRTLCls(void)
{
  return NVTabBarPagerRTLComponentView.class;
}

#endif
