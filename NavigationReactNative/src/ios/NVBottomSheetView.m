#import "NVBottomSheetView.h"
#import "NVBottomSheetController.h"

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTTouchHandler.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>

@implementation NVBottomSheetView
{
    __weak RCTBridge *_bridge;
    NVBottomSheetController *_bottomSheetController;
    UIView *_reactSubview;
    CGSize _oldSize;
    BOOL _presented;
    NSInteger _nativeEventCount;
    CADisplayLink *_displayLink;
    RCTTouchHandler *_touchHandler;
    UISheetPresentationControllerDetent *_collapsedDetent;
    UISheetPresentationControllerDetent *_expandedDetent;
    UISheetPresentationControllerDetent *_halfExpandedDetent;
}

- (id)initWithBridge:(RCTBridge *)bridge
{
    if (self = [super init]) {
        _bridge = bridge;
        _bottomSheetController = [[NVBottomSheetController alloc] init];
        _touchHandler = [[RCTTouchHandler alloc] initWithBridge:bridge];
        _collapsedDetent = UISheetPresentationControllerDetent.mediumDetent;
        _expandedDetent = UISheetPresentationControllerDetent.largeDetent;
        _halfExpandedDetent = UISheetPresentationControllerDetent.largeDetent;
        __weak typeof(self) weakSelf = self;
        _bottomSheetController.boundsDidChangeBlock = ^(CGRect newBounds) {
            [weakSelf notifyForBoundsChange:newBounds];
        };
        _bottomSheetController.didDismiss = ^{
            [weakSelf sheetViewDidDismiss];
        };
    }
    return self;
}


-(void)sheetViewDidDismiss
{
    _presented = NO;
    _dismissed = YES;
    [_displayLink invalidate];
    if (!!self.onDismissed) {
        self.onDismissed(@{});
    }
}


- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    UISheetPresentationController *sheet = _bottomSheetController.sheetPresentationController;
    _collapsedDetent = UISheetPresentationControllerDetent.mediumDetent;
    _expandedDetent = UISheetPresentationControllerDetent.largeDetent;
    _halfExpandedDetent = UISheetPresentationControllerDetent.largeDetent;
    __weak typeof(self) weakSelf = self;
    if (@available(iOS 16.0, *)) {
        if (_peekHeight > 0) {
            _collapsedDetent = [UISheetPresentationControllerDetent customDetentWithIdentifier:@"collapsed" resolver:^CGFloat(id<UISheetPresentationControllerDetentResolutionContext> _Nonnull context) {
                return weakSelf.peekHeight;
            }];
        }
        if (_expandedHeight > 0 || _expandedOffset > 0) {
            _expandedDetent = [UISheetPresentationControllerDetent customDetentWithIdentifier:@"expanded" resolver:^CGFloat(id<UISheetPresentationControllerDetentResolutionContext> _Nonnull context) {
                return weakSelf.expandedHeight > 0 ? weakSelf.expandedHeight : context.maximumDetentValue - weakSelf.expandedOffset;
            }];
        }
        if (_halfExpandedRatio > 0) {
            _halfExpandedDetent = [UISheetPresentationControllerDetent customDetentWithIdentifier:@"halfExpanded" resolver:^CGFloat(id<UISheetPresentationControllerDetentResolutionContext> _Nonnull context) {
                return weakSelf.halfExpandedRatio * context.maximumDetentValue;
            }];
        }
    }
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    UISheetPresentationControllerDetentIdentifier newDetent = [_detent isEqual: @"collapsed"] ? [self collapsedIdentifier] : ([_detent isEqual: @"expanded"] ? [self expandedIdentifier] : [self halfExpandedIdentifier]);
    [self setHidden:_dismissed];
    if (![_detent isEqual: @"hidden"]) {
        if (self.window && !_presented && !_dismissed) {
            _presented = YES;
            _bottomSheetController.sheetPresentationController.delegate = self;
            _bottomSheetController.presentationController.delegate = self;
            _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(resizeView)];
            [_displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
            [[self reactViewController] presentViewController:_bottomSheetController animated:true completion:nil];
        }
        sheet.largestUndimmedDetentIdentifier = !self.modal ? [self expandedIdentifier] : nil;
        [sheet animateChanges:^{
            [sheet setDetents: [[self halfExpandedIdentifier] isEqual:UISheetPresentationControllerDetentIdentifierLarge] ? @[_collapsedDetent, _expandedDetent] : @[_collapsedDetent, _halfExpandedDetent, _expandedDetent]];
            if (_skipCollapsed && ![_detent isEqual:@"collapsed"]) {
                [sheet setDetents: [[self halfExpandedIdentifier] isEqual:UISheetPresentationControllerDetentIdentifierLarge] ? @[ _expandedDetent] : @[_halfExpandedDetent, _expandedDetent]];
            }
            if (!_draggable) {
                [sheet setDetents: @[[newDetent isEqual:[self collapsedIdentifier]] ? _collapsedDetent : ([newDetent isEqual:[self expandedIdentifier]] ? _expandedDetent : _halfExpandedDetent)]];
            }
            if (eventLag == 0 && [sheet selectedDetentIdentifier] != newDetent) {
                sheet.selectedDetentIdentifier = newDetent;
            }
        }];
    } else {
        [_bottomSheetController dismissViewControllerAnimated:YES completion:nil];
        _presented = NO;
        [_displayLink invalidate];
    }
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

- (void)dealloc
{
    [_bottomSheetController dismissViewControllerAnimated:NO completion:nil];
}

- (void)notifyForBoundsChange:(CGRect)newBounds
{
    if (_reactSubview) {
        CAAnimation *dropping = [_bottomSheetController.view.layer animationForKey:@"bounds.size"];
        if (!dropping) {
            [_bridge.uiManager setSize:newBounds.size forView:self];
        }
    }
}

- (void)resizeView
{
    CGSize newSize = [[_bottomSheetController.view.layer.presentationLayer valueForKeyPath:@"frame.size"] CGSizeValue];
    if (!CGSizeEqualToSize(_oldSize, newSize)) {
        _oldSize = newSize;
        [_bridge.uiManager setSize:newSize forView:self];
    }
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    [_touchHandler attachToView:subview];
    [_bottomSheetController.view insertSubview:subview atIndex:0];
    _reactSubview = subview;
}

- (void)removeReactSubview:(UIView *)subview
{
    [super removeReactSubview:subview];
    [_touchHandler detachFromView:subview];
    _reactSubview = nil;
}

- (void)didUpdateReactSubviews
{
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    if (![_detent isEqual: @"hidden"] && !_presented && !_dismissed && self.window) {
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
    if (!!self.onDetentChanged) {
        UISheetPresentationControllerDetentIdentifier detentId = sheetPresentationController.selectedDetentIdentifier;
        self.onDetentChanged(@{
            @"detent": [[self collapsedIdentifier] isEqual:detentId] ? @"collapsed" : ([[self expandedIdentifier] isEqual:detentId] ? @"expanded" : @"halfExpanded"),
            @"eventCount": @(_nativeEventCount),
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
    if (!!self.onDetentChanged) {
        self.onDetentChanged(@{
            @"detent": @"hidden",
            @"eventCount": @(_nativeEventCount),
        });
    }
}

@end

