#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSearchToolbarComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVSearchToolbarComponentView () <RCTNVSearchToolbarViewProtocol>
@end

@implementation NVSearchToolbarComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVSearchToolbarComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVSearchToolbarCls(void)
{
  return NVSearchToolbarComponentView.class;
}

#endif
