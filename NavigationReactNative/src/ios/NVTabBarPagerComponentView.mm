#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTabBarPagerComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVTabBarPagerComponentView () <RCTNVTabBarPagerViewProtocol>
@end

@implementation NVTabBarPagerComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVTabBarPagerProps>();
        _props = defaultProps;
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVTabBarPagerComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVTabBarPagerCls(void)
{
  return NVTabBarPagerComponentView.class;
}
#endif
