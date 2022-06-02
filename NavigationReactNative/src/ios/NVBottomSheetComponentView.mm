#ifdef RCT_NEW_ARCH_ENABLED
#import "NVBottomSheetComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVBottomSheetComponentView () <RCTNVBottomSheetViewProtocol>
@end

@implementation NVBottomSheetComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVBottomSheetComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVBottomSheetCls(void)
{
  return NVBottomSheetComponentView.class;
}

#endif
