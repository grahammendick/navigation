#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSceneComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVSceneComponentView () <RCTNVSceneViewProtocol>
@end

@implementation NVSceneComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVSceneProps>();
        _props = defaultProps;
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<NVSceneProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<NVSceneProps const>(props);
    if (oldViewProps.sceneKey != newViewProps.sceneKey) {
        _sceneKey = [[NSString alloc] initWithUTF8String: newViewProps.sceneKey.c_str()];
    }
    if (oldViewProps.crumb != newViewProps.crumb) {
        _crumb = newViewProps.crumb;
    }
    [super updateProps:props oldProps:oldProps];
}

- (void)didPop
{
    std::static_pointer_cast<NVSceneEventEmitter const>(_eventEmitter)
        ->onPopped(NVSceneEventEmitter::OnPopped{});
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVSceneComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVSceneCls(void)
{
  return NVSceneComponentView.class;
}
#endif
