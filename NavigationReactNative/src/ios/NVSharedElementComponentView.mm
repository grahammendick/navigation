#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSharedElementComponentView.h"
#import "NVSceneComponentView.h"

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
    if (![[self getScene].sharedElements containsObject:self])
        [[self getScene].sharedElements addObject:self];
}

- (void)willMoveToSuperview:(UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview)
        [[self getScene].sharedElements removeObject:self];
}

- (NVSceneComponentView*) getScene
{
    UIView *parentView = (UIView *)self.superview;
    while (parentView) {
        if ([parentView isKindOfClass:[NVSceneComponentView class]]) {
            return (NVSceneComponentView*) parentView;;
        }
        parentView = parentView.superview;
    }
    return nil;
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
