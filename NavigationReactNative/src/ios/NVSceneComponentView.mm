#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSceneComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/UIView+React.h>

using namespace facebook::react;

@interface NVSceneComponentView () <RCTNVSceneViewProtocol>
@end

@implementation NVSceneComponentView
{
    BOOL _notifiedPeekable;
}

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
    const auto &newViewProps = *std::static_pointer_cast<NVSceneProps const>(props);
    _sceneKey = [[NSString alloc] initWithUTF8String: newViewProps.sceneKey.c_str()];
    _crumb = [NSNumber numberWithInt:newViewProps.crumb];
    _title = [[NSString alloc] initWithUTF8String: newViewProps.title.c_str()];
    _hidesTabBar = newViewProps.hidesTabBar;
    dispatch_async(dispatch_get_main_queue(), ^{
        [self didUpdate];
    });
    [super updateProps:props oldProps:oldProps];
}

- (void)didPop
{
    if (_eventEmitter != nullptr) {
        std::static_pointer_cast<NVSceneEventEmitter const>(_eventEmitter)
            ->onPopped(NVSceneEventEmitter::OnPopped{});
    }
}

- (void)didUpdate
{
    if (!_notifiedPeekable && self.subviews.count > 0) {
        _notifiedPeekable = YES;
        if (self.peekableDidChangeBlock) {
            self.peekableDidChangeBlock();
        }
    }
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    [self.reactViewController willMoveToParentViewController:nil];
    [self.reactViewController.view removeFromSuperview];
    [self.reactViewController removeFromParentViewController];
    self.reactViewController.view = nil;
    _notifiedPeekable = NO;
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
