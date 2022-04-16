#ifdef RCT_NEW_ARCH_ENABLED
#import "NVNavigationBarComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVNavigationBarComponentView () <RCTNVNavigationBarViewProtocol>
@end

@implementation NVNavigationBarComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVNavigationBarProps>();
        _props = defaultProps;
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<NVNavigationBarProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<NVNavigationBarProps const>(props);
    [super updateProps:props oldProps:oldProps];
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVNavigationBarComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVNavigationBarCls(void)
{
  return NVNavigationBarComponentView.class;
}
#endif
