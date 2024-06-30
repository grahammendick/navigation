#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSheetComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVSheetComponentView () <RCTNVSheetViewProtocol>
@end

@implementation NVSheetComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVSheetComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVSheetCls(void)
{
  return NVSheetComponentView.class;
}

#endif
