#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTitleBarComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>
#import <navigationreactnative/NVTitleBarComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import <React/UIView+React.h>

using namespace facebook::react;

@interface NVTitleBarComponentView () <RCTNVTitleBarViewProtocol>
@end

@implementation NVTitleBarComponentView
{
    CGRect _lastViewFrame;
    NVTitleBarShadowNode::ConcreteState::Shared _state;
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
        auto newState = NVTitleBarState{RCTSizeFromCGSize(self.bounds.size)};
        _state->updateState(std::move(newState));
    }
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _state.reset();
    _lastViewFrame = CGRectMake(0, 0, 0, 0);
    self.reactViewController.navigationItem.titleView = nil;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateState:(facebook::react::State::Shared const &)state
           oldState:(facebook::react::State::Shared const &)oldState
{
  _state = std::static_pointer_cast<const NVTitleBarShadowNode::ConcreteState>(state);
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
