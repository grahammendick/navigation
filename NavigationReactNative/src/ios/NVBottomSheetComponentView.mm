#ifdef RCT_NEW_ARCH_ENABLED
#import "NVBottomSheetComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVBottomSheetController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(CGRect newBounds);

@end

@implementation NVBottomSheetController
{
    CGRect _lastViewFrame;
}

- (void)viewDidLayoutSubviews
{
    [super viewDidLayoutSubviews];
    if (self.boundsDidChangeBlock && !CGRectEqualToRect(_lastViewFrame, self.view.frame)) {
        self.boundsDidChangeBlock(self.view.bounds);
        _lastViewFrame = self.view.frame;
    }
}

@end

@interface NVBottomSheetComponentView () <RCTNVBottomSheetViewProtocol>
@end

@implementation NVBottomSheetComponentView
{
    NVBottomSheetController *_bottomSheetController;
    NVBottomSheetController *_oldBottomSheetController;
    UIView *_reactSubview;
    BOOL _presented;
    NSInteger _nativeEventCount;
    CADisplayLink *_displayLink;
    UISheetPresentationControllerDetent *_collapsedDetent;
    UISheetPresentationControllerDetent *_expandedDetent;
    UISheetPresentationControllerDetent *_halfExpandedDetent;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVBarButtonProps>();
        _props = defaultProps;
        _collapsedDetent = UISheetPresentationControllerDetent.mediumDetent;
        _expandedDetent = UISheetPresentationControllerDetent.largeDetent;
        _halfExpandedDetent = UISheetPresentationControllerDetent.largeDetent;
    }
    return self;
}

- (void)ensureBottomSheetController
{
    if (!_bottomSheetController) {
        [_oldBottomSheetController willMoveToParentViewController:nil];
        [_oldBottomSheetController.view removeFromSuperview];
        [_oldBottomSheetController removeFromParentViewController];
        UIView *containerView = [UIView new];
        containerView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
        _bottomSheetController.view = containerView;
        _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(resizeView)];
        [_displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
        id __weak weakSelf = self;
        _bottomSheetController.boundsDidChangeBlock = ^(CGRect newBounds) {
            [weakSelf notifyForBoundsChange:newBounds];
        };
    }
}
- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [self ensureBottomSheetController];
    const auto &newViewProps = *std::static_pointer_cast<NVBottomSheetProps const>(props);
    [super updateProps:props oldProps:oldProps];
}

- (void)notifyForBoundsChange:(CGRect)newBounds
{
}

- (void)resizeView
{
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVBottomSheetComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVBottomSheetCls(void)
{
    if (@available(iOS 15.0, *)) {
        return NVBottomSheetComponentView.class;
    } else {
        return nil;
    }
}

#endif
