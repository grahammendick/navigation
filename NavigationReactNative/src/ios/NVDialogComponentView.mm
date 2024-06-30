#ifdef RCT_NEW_ARCH_ENABLED
#import "NVDialogComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>
#import <NVDialogComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVDialogComponentView () <RCTNVDialogViewProtocol>
@end

@implementation NVDialogComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVDialogComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVDialogCls(void)
{
  return NVDialogComponentView.class;
}

#endif
