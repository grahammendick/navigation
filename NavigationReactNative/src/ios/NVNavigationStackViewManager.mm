#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import "NVNavigationStackView.h"

using namespace facebook::react;

NS_ASSUME_NONNULL_BEGIN

@interface NVNavigationStackViewManager : RCTViewComponentView

@end

NS_ASSUME_NONNULL_END


@interface NVNavigationStackViewManager () <RCTNVNavigationStackViewProtocol>
@end

@implementation NVNavigationStackViewManager

- (instancetype)initWithFrame:(CGRect)frame
{
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVNavigationStackComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVNavigationStackCls(void)
{
  return NVNavigationStackViewManager.class;
}
#endif
