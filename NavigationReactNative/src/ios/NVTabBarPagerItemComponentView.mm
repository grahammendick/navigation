#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTabBarPagerItemComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVTabBarPagerItemComponentView () <RCTNVTabBarPagerItemViewProtocol>
@end

@implementation NVTabBarPagerItemComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVTabBarPagerItemComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVTabBarPagerItemCls(void)
{
  return NVTabBarPagerItemComponentView.class;
}

#endif
