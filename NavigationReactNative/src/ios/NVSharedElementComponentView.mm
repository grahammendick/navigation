#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSharedElementComponentView.h"
#import "NVSceneController.h"
#import <React/UIView+React.h>

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVSharedElementComponentView () <RCTNVSharedElementViewProtocol>
@end

@implementation NVSharedElementComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newViewProps = *std::static_pointer_cast<NVSharedElementProps const>(props);
    _name = [NSString  stringWithUTF8String: newViewProps.name.c_str()];
    [super updateProps:props oldProps:oldProps];
}
- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [((UIViewController<NVSharedElementController> *) self.reactViewController).sharedElements addObject:self];
}

- (void)willMoveToSuperview:(UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview)
        [((UIViewController<NVSharedElementController> *) self.reactViewController).sharedElements removeObject:self];
}



#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVSharedElementComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVSharedElementCls(void)
{
  return NVSharedElementComponentView.class;
}

#endif
