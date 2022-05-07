#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSegmentedTabComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVSegmentedTabComponentView () <RCTNVSegmentedTabViewProtocol>
@end

@implementation NVSegmentedTabComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVSegmentedTabProps>();
        _props = defaultProps;
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVSegmentedTabComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVSegmentedTabCls(void)
{
  return NVSegmentedTabComponentView.class;
}
#endif
