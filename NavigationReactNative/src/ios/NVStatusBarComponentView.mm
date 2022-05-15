#ifdef RCT_NEW_ARCH_ENABLED
#import "NVStatusBarComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVStatusBarComponentView () <RCTNVStatusBarViewProtocol>
@end

@implementation NVStatusBarComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVStatusBarProps>();
        _props = defaultProps;
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVStatusBarComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVStatusBarCls(void)
{
  return NVStatusBarComponentView.class;
}
#endif
