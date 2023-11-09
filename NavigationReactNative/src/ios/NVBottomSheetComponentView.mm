#ifdef RCT_NEW_ARCH_ENABLED
#import "NVBottomSheetComponentView.h"
#import "NVBottomSheetController.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/UIView+React.h>

using namespace facebook::react;

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
    NSInteger eventLag = _nativeEventCount - newViewProps.mostRecentEventCount;
    NSString *detent = [[NSString alloc] initWithUTF8String: newViewProps.detent.c_str()];
    UISheetPresentationControllerDetentIdentifier newDetent = [detent isEqual: @"collapsed"] ? [self collapsedIdentifier] : ([detent isEqual: @"expanded"] ? [self expandedIdentifier] : [self halfExpandedIdentifier]);
    if (![detent isEqual: @"hidden"]) {
        if (self.window && !_presented) {
            _presented = YES;
            _bottomSheetController.sheetPresentationController.delegate = self;
            _bottomSheetController.presentationController.delegate = self;
            [[self reactViewController] presentViewController:_bottomSheetController animated:true completion:nil];
        }
        [sheet animateChanges:^{
            [sheet setDetents: [[self halfExpandedIdentifier] isEqual:UISheetPresentationControllerDetentIdentifierLarge] ? @[_collapsedDetent, _expandedDetent] : @[_collapsedDetent, _halfExpandedDetent, _expandedDetent]];
            if (newViewProps.skipCollapsed && ![detent isEqual:@"collapsed"]) {
                [sheet setDetents: [[self halfExpandedIdentifier] isEqual:UISheetPresentationControllerDetentIdentifierLarge] ? @[ _expandedDetent] : @[_halfExpandedDetent, _expandedDetent]];
            }
            if (!newViewProps.draggable) {
                [sheet setDetents: @[[newDetent isEqual:[self collapsedIdentifier]] ? _collapsedDetent : ([newDetent isEqual:[self expandedIdentifier]] ? _expandedDetent : _halfExpandedDetent)]];
            }
            if (eventLag == 0 && [sheet selectedDetentIdentifier] != newDetent) {
                sheet.selectedDetentIdentifier = newDetent;
            }
        }];
    } else {
        [_bottomSheetController dismissViewControllerAnimated:YES completion:nil];
        _presented = NO;
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
