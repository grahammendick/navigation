#ifdef RCT_NEW_ARCH_ENABLED
#import "NVBottomSheetComponentView.h"
#import "NVBottomSheetController.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>
#import <NVBottomSheetComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <React/UIView+React.h>

using namespace facebook::react;

@interface NVBottomSheetComponentView () <RCTNVBottomSheetViewProtocol>
@end

@implementation NVBottomSheetComponentView
{
    NVBottomSheetController *_bottomSheetController;
    NVBottomSheetController *_oldBottomSheetController;
    CGSize _oldSize;
    BOOL _presented;
    NSInteger _nativeEventCount;
    NSString *_detent;
    BOOL _hideable;
    CADisplayLink *_displayLink;
    RCTSurfaceTouchHandler *_touchHandler;
    UISheetPresentationControllerDetent *_collapsedDetent;
    UISheetPresentationControllerDetent *_expandedDetent;
    UISheetPresentationControllerDetent *_halfExpandedDetent;
    NVBottomSheetShadowNode::ConcreteState::Shared _state;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVBarButtonProps>();
        _props = defaultProps;
        _touchHandler = [RCTSurfaceTouchHandler new];
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
        _bottomSheetController = [[NVBottomSheetController alloc] init];
        id __weak weakSelf = self;
        _bottomSheetController.boundsDidChangeBlock = ^(CGRect newBounds) {
            [weakSelf notifyForBoundsChange:newBounds];
        };
        _bottomSheetController.didDismiss = ^{
            [weakSelf sheetViewDidDismiss];
        };
    }
}

-(void)sheetViewDidDismiss
{
    _presented = NO;
    [_displayLink invalidate];
    if (_eventEmitter != nullptr) {
        std::static_pointer_cast<NVBottomSheetEventEmitter const>(_eventEmitter)
            ->onDismissed(NVBottomSheetEventEmitter::OnDismissed{});
    }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [self ensureBottomSheetController];
    const auto &newViewProps = *std::static_pointer_cast<NVBottomSheetProps const>(props);
    UISheetPresentationController *sheet = _bottomSheetController.sheetPresentationController;
    _collapsedDetent = UISheetPresentationControllerDetent.mediumDetent;
    _expandedDetent = UISheetPresentationControllerDetent.largeDetent;
    _halfExpandedDetent = UISheetPresentationControllerDetent.largeDetent;
    if (@available(iOS 16.0, *)) {
        int peekHeight = newViewProps.peekHeight;
        if (peekHeight > 0) {
            _collapsedDetent = [UISheetPresentationControllerDetent customDetentWithIdentifier:@"collapsed" resolver:^CGFloat(id<UISheetPresentationControllerDetentResolutionContext> _Nonnull context) {
                return peekHeight;
            }];
        }
        int expandedHeight = newViewProps.expandedHeight;
        int expandedOffset = newViewProps.expandedOffset;
        if (expandedHeight > 0 || expandedOffset > 0) {
            _expandedDetent = [UISheetPresentationControllerDetent customDetentWithIdentifier:@"expanded" resolver:^CGFloat(id<UISheetPresentationControllerDetentResolutionContext> _Nonnull context) {
                return expandedHeight > 0 ? expandedHeight : context.maximumDetentValue - expandedOffset;
            }];
        }
        float halfExpandedRatio = [@(newViewProps.halfExpandedRatio) floatValue];
        if (halfExpandedRatio > 0) {
            _halfExpandedDetent = [UISheetPresentationControllerDetent customDetentWithIdentifier:@"halfExpanded" resolver:^CGFloat(id<UISheetPresentationControllerDetentResolutionContext> _Nonnull context) {
                return halfExpandedRatio * context.maximumDetentValue;
            }];
        }
    }
    _hideable = newViewProps.hideable;
    NSInteger eventLag = _nativeEventCount - newViewProps.mostRecentEventCount;
    _detent = [[NSString alloc] initWithUTF8String: newViewProps.detent.c_str()];
    UISheetPresentationControllerDetentIdentifier newDetent = [_detent isEqual: @"collapsed"] ? [self collapsedIdentifier] : ([_detent isEqual: @"expanded"] ? [self expandedIdentifier] : [self halfExpandedIdentifier]);
    if (![_detent isEqual: @"hidden"]) {
        if (self.window && !_presented) {
            _presented = YES;
            _bottomSheetController.sheetPresentationController.delegate = self;
            _bottomSheetController.presentationController.delegate = self;
            _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(resizeView)];
            [_displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
            [[self reactViewController] presentViewController:_bottomSheetController animated:true completion:nil];
        }
        sheet.largestUndimmedDetentIdentifier = !newViewProps.modal ? [self expandedIdentifier] : nil;
        dispatch_async(dispatch_get_main_queue(), ^{
            [sheet animateChanges:^{
                [sheet setDetents: [[self halfExpandedIdentifier] isEqual:UISheetPresentationControllerDetentIdentifierLarge] ? @[self->_collapsedDetent, self->_expandedDetent] : @[self->_collapsedDetent, self->_halfExpandedDetent, self->_expandedDetent]];
                if (newViewProps.skipCollapsed && ![self->_detent isEqual:@"collapsed"]) {
                    [sheet setDetents: [[self halfExpandedIdentifier] isEqual:UISheetPresentationControllerDetentIdentifierLarge] ? @[self->_expandedDetent] : @[self->_halfExpandedDetent, self->_expandedDetent]];
                }
                if (!newViewProps.draggable) {
                    [sheet setDetents: @[[newDetent isEqual:[self collapsedIdentifier]] ? self->_collapsedDetent : ([newDetent isEqual:[self expandedIdentifier]] ? self->_expandedDetent : self->_halfExpandedDetent)]];
                }
                if (eventLag == 0 && [sheet selectedDetentIdentifier] != newDetent) {
                    sheet.selectedDetentIdentifier = newDetent;
                }
            }];
        });
    } else {
        [_bottomSheetController dismissViewControllerAnimated:YES completion:nil];
        _presented = NO;
        [_displayLink invalidate];
    }
    [super updateProps:props oldProps:oldProps];
}

- (UISheetPresentationControllerDetentIdentifier) collapsedIdentifier
{
    UISheetPresentationControllerDetentIdentifier collapsedIdentifier = UISheetPresentationControllerDetentIdentifierMedium;
    if (@available(iOS 16.0, *)) {
        collapsedIdentifier = _collapsedDetent.identifier;
    }
    return collapsedIdentifier;
}

- (UISheetPresentationControllerDetentIdentifier) halfExpandedIdentifier
{
    UISheetPresentationControllerDetentIdentifier halfExpandedIdentifier = UISheetPresentationControllerDetentIdentifierLarge;
    if (@available(iOS 16.0, *)) {
        halfExpandedIdentifier = _halfExpandedDetent.identifier;
    }
    return halfExpandedIdentifier;
}

- (UISheetPresentationControllerDetentIdentifier) expandedIdentifier
{
    UISheetPresentationControllerDetentIdentifier expandedIdentifier = UISheetPresentationControllerDetentIdentifierLarge;
    if (@available(iOS 16.0, *)) {
        expandedIdentifier = _expandedDetent.identifier;
    }
    return expandedIdentifier;
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _state.reset();
    _nativeEventCount = 0;
    [_bottomSheetController dismissViewControllerAnimated:NO completion:nil];
    _oldBottomSheetController = _bottomSheetController;
    _bottomSheetController = nil;
    _oldSize = CGSizeZero;
    _presented = NO;
    [_displayLink invalidate];
}

- (void)dealloc
{
    [_bottomSheetController dismissViewControllerAnimated:NO completion:nil];
}

- (void)notifyForBoundsChange:(CGRect)newBounds
{
    if (_state != nullptr) {
        CAAnimation *dropping = [_bottomSheetController.view.layer animationForKey:@"bounds.size"];
        if (!dropping) {
            auto newState = NVBottomSheetState{RCTSizeFromCGSize(newBounds.size)};
            _state->updateState(std::move(newState));
        }
    }
}

- (void)resizeView
{
    CGSize newSize = [[_bottomSheetController.view.layer.presentationLayer valueForKeyPath:@"frame.size"] CGSizeValue];
    if (!CGSizeEqualToSize(_oldSize, newSize) && _state != nullptr) {
        _oldSize = newSize;
        auto newState = NVBottomSheetState{RCTSizeFromCGSize(newSize)};
        _state->updateState(std::move(newState));
    }
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    if (![_detent isEqual: @"hidden"] && !_presented && self.window) {
        _presented = YES;
        _bottomSheetController.sheetPresentationController.delegate = self;
        _bottomSheetController.presentationController.delegate = self;
        _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(resizeView)];
        [_displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
        [[self reactViewController] presentViewController:_bottomSheetController animated:true completion:nil];
    }
}

- (void)sheetPresentationControllerDidChangeSelectedDetentIdentifier:(UISheetPresentationController *)sheetPresentationController
{
    _nativeEventCount++;
    if (_eventEmitter != nullptr) {
        UISheetPresentationControllerDetentIdentifier detentId = sheetPresentationController.selectedDetentIdentifier;
        std::static_pointer_cast<NVBottomSheetEventEmitter const>(_eventEmitter)
            ->onDetentChanged(NVBottomSheetEventEmitter::OnDetentChanged{
                .detent = std::string([[[self collapsedIdentifier] isEqual:detentId] ? @"collapsed" : ([[self expandedIdentifier] isEqual:detentId] ? @"expanded" : @"halfExpanded") UTF8String]),
                .eventCount = static_cast<int>(_nativeEventCount),
            });
    }
}

- (BOOL)presentationControllerShouldDismiss:(UIPresentationController *)presentationController
{
    return _hideable;
}

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
    _nativeEventCount++;
    if (_eventEmitter != nullptr) {
        std::static_pointer_cast<NVBottomSheetEventEmitter const>(_eventEmitter)
            ->onDetentChanged(NVBottomSheetEventEmitter::OnDetentChanged{
                .detent = std::string([@"hidden" UTF8String]),
                .eventCount = static_cast<int>(_nativeEventCount),
            });
        std::static_pointer_cast<NVBottomSheetEventEmitter const>(_eventEmitter)
            ->onDismissed(NVBottomSheetEventEmitter::OnDismissed{});
    }
}

#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self ensureBottomSheetController];
    [_touchHandler attachToView:childComponentView];
    [_bottomSheetController.view insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [childComponentView removeFromSuperview];
    [_touchHandler detachFromView:childComponentView];
}

- (void)updateState:(facebook::react::State::Shared const &)state
           oldState:(facebook::react::State::Shared const &)oldState
{
    _state = std::static_pointer_cast<const NVBottomSheetShadowNode::ConcreteState>(state);
}

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
