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
    for (NVBarButtonComponentView *button in self.buttons) {
        [((UIViewController<NVSharedElementController> *) self.reactViewController).sharedElements addObject:button];
    }
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
    NSMutableArray *barButtons = [NSMutableArray arrayWithCapacity:buttons.count];
    for (NVBarButtonComponentView *button in buttons) {
        [barButtons addObject:button.button];
    }
    [self.reactViewController.navigationItem setRightBarButtonItems:barButtons];
}

#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self.buttons insertObject:(NVBarButtonComponentView *) childComponentView atIndex:index];
    [self setBarButtons:self.buttons];
    [((UIViewController<NVSharedElementController> *) self.reactViewController).sharedElements addObject:(NVBarButtonComponentView *) childComponentView];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self.buttons removeObject:(NVBarButtonComponentView *) childComponentView];
    [self setBarButtons:self.buttons];
    [((UIViewController<NVSharedElementController> *) self.reactViewController).sharedElements removeObject:(NVBarButtonComponentView *) childComponentView];
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
