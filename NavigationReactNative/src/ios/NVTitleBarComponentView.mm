#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTitleBarComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVTitleBarComponentView () <RCTNVTitleBarViewProtocol>
@end

@implementation NVTitleBarComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVTitleBarProps>();
        _props = defaultProps;
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVTitleBarComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVTitleBarCls(void)
{
  return NVTitleBarComponentView.class;
}
#endif
