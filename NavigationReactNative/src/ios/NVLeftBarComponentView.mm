#ifdef RCT_NEW_ARCH_ENABLED
#import "NVLeftBarComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/UIView+React.h>
#import "NVBarButtonComponentView.h"

using namespace facebook::react;

@interface NVLeftBarComponentView () <RCTNVLeftBarViewProtocol>
@end

@implementation NVLeftBarComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVLeftBarProps>();
        _props = defaultProps;
        self.buttons = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newViewProps = *std::static_pointer_cast<NVLeftBarProps const>(props);
    _supplementBack = newViewProps.supplementBack;
    [self.reactViewController.navigationItem setLeftItemsSupplementBackButton:_supplementBack];
    [super updateProps:props oldProps:oldProps];
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [self setBarButtons:self.buttons];
    [self.reactViewController.navigationItem setLeftItemsSupplementBackButton:_supplementBack];
}

- (void)willMoveToSuperview:(nullable UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview) {
        [self setBarButtons:nil];
    }
}

-(void)setBarButtons:(NSMutableArray *)buttons
{
    [self.reactViewController.navigationItem setLeftBarButtonItems:buttons];
}

#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self.buttons insertObject:((NVBarButtonComponentView *) childComponentView).button atIndex:index];
    [self setBarButtons:self.buttons];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self.buttons removeObject:((NVBarButtonComponentView *) childComponentView).button];
    [self setBarButtons:self.buttons];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVLeftBarComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVLeftBarCls(void)
{
  return NVLeftBarComponentView.class;
}
#endif
