#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSearchResultsComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVSearchResultsComponentView () <RCTNVSearchResultsViewProtocol>
@end

@implementation NVSearchResultsComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVSearchResultsComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVSearchResultsCls(void)
{
  return NVSearchResultsComponentView.class;
}

#endif
