#ifdef RCT_NEW_ARCH_ENABLED
#import "NVRightBarComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/UIView+React.h>
#import "NVBarButtonComponentView.h"

using namespace facebook::react;

@interface NVRightBarComponentView () <RCTNVRightBarViewProtocol>
@end

@implementation NVRightBarComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVRightBarProps>();
        _props = defaultProps;
        self.buttons = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [self setBarButtons:self.buttons];
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
    [self.reactViewController.navigationItem setRightBarButtonItems:buttons];
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
  return concreteComponentDescriptorProvider<NVRightBarComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVRightBarCls(void)
{
  return NVRightBarComponentView.class;
}
#endif
