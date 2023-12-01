#ifdef RCT_NEW_ARCH_ENABLED
#import "NVBottomSheetDialogComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>
#import <NVBottomSheetDialogComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVBottomSheetDialogComponentView () <RCTNVBottomSheetDialogViewProtocol>
@end

@implementation NVBottomSheetDialogComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVBottomSheetDialogComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVBottomSheetDialogCls(void)
{
  return NVBottomSheetDialogComponentView.class;
}

#endif
