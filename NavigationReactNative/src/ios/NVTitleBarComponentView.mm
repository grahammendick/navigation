#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTitleBarComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>
#import <navigation-react-native/NVTitleBarComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import <React/UIView+React.h>

using namespace facebook::react;

@interface NVTitleBarComponentView () <RCTNVTitleBarViewProtocol>
@end

@implementation NVTitleBarComponentView
{
    CGRect _lastViewFrame;
    facebook::react::NVTitleBarShadowNode::ConcreteState::Shared _state;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVTitleBarProps>();
        _props = defaultProps;
    }
    return self;
}

- (void)didMoveToWindow {
    [super didMoveToWindow];
    self.reactViewController.navigationItem.titleView = self;
}

- (void)willMoveToSuperview:(UIView *)newSuperview {
    [super willMoveToSuperview:newSuperview];    
    if (newSuperview == nil) {
        self.reactViewController.navigationItem.titleView = nil;
    }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    if (_state != nullptr) {
        auto newState = facebook::react::NVTitleBarState{RCTSizeFromCGSize(self.bounds.size)};
        _state->updateState(std::move(newState));
    }
    if (!CGRectEqualToRect(_lastViewFrame, self.frame)) {
        std::static_pointer_cast<NVTitleBarEventEmitter const>(_eventEmitter)
            ->onChangeBounds(NVTitleBarEventEmitter::OnChangeBounds{
                .width = static_cast<float>(self.frame.size.width),
                .height = static_cast<float>(self.frame.size.height),
            });
        _lastViewFrame = self.frame;
    }
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _lastViewFrame = CGRectMake(0, 0, 0, 0);
    self.reactViewController.navigationItem.titleView = nil;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateState:(facebook::react::State::Shared const &)state
           oldState:(facebook::react::State::Shared const &)oldState
{
  _state = std::static_pointer_cast<const facebook::react::NVTitleBarShadowNode::ConcreteState>(state);
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVTitleBarComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVTitleBarCls(void)
{
  return NVTitleBarComponentView.class;
}
#endif
