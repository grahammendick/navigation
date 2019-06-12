#import "NVSearchBarView.h"
#import "NVSearchResultsController.h"

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTTouchHandler.h>
#import <React/UIView+React.h>

@implementation NVSearchBarView
{
    __weak RCTBridge *_bridge;
    RCTTouchHandler *_touchHandler;
    UIView *_reactSubview;
    NSInteger _nativeEventCount;
}

- (id)initWithBridge:(RCTBridge *)bridge
{
    if (self = [super initWithFrame:CGRectZero]) {
        _bridge = bridge;
        self.tag = SEARCH_BAR;
        NVSearchResultsController *viewController = [[NVSearchResultsController alloc] init];
        self.searchController = [[UISearchController alloc] initWithSearchResultsController:viewController];
        self.searchController.searchResultsUpdater = self;
        _touchHandler = [[RCTTouchHandler alloc] initWithBridge:bridge];
        __weak typeof(self) weakSelf = self;
        viewController.boundsDidChangeBlock = ^(CGRect newBounds) {
            [weakSelf notifyForBoundsChange:newBounds];
        };
    }
    return self;
}

- (void)setObscureBackground:(BOOL)obscureBackground
{
    [self.searchController setObscuresBackgroundDuringPresentation:obscureBackground];
}

- (void)setHideNavigationBar:(BOOL)hideNavigationBar
{
    [self.searchController setHidesNavigationBarDuringPresentation:hideNavigationBar];
}

- (void)setAutoCapitalize:(UITextAutocapitalizationType)autoCapitalize
{
    [self.searchController.searchBar setAutocapitalizationType:autoCapitalize];
}

- (void)setPlaceholder:(NSString *)placeholder
{
    [self.searchController.searchBar setPlaceholder:placeholder];
}

- (void)setText:(NSString *)text
{
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    if (eventLag == 0 && [self.searchController.searchBar text] != text) {
        [self.searchController.searchBar setText:text];
    }
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    if (@available(iOS 11.0, *)) {
        [self.reactViewController.navigationItem setHidesSearchBarWhenScrolling:self.hideWhenScrolling];
    }
}

- (void)notifyForBoundsChange:(CGRect)newBounds
{
    if (_reactSubview) {
        [_bridge.uiManager setSize:newBounds.size forView:_reactSubview];
    }
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    self.searchController.searchResultsController.view = subview;
    [_touchHandler attachToView:subview];
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
    if (@available(iOS 11.0, *)) {
        [self.reactViewController.navigationItem setSearchController:_searchController];
    }
}

- (void)willMoveToSuperview:(nullable UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview) {
        if (@available(iOS 11.0, *)) {
            [self.reactViewController.navigationItem setSearchController:nil];
            [self.searchController.searchResultsController dismissViewControllerAnimated:NO completion:nil];
        }
    }
}

- (void)updateSearchResultsForSearchController:(UISearchController *)searchController {
    _nativeEventCount++;
    if (!!self.onChangeText) {
        self.onChangeText(@{
            @"text": searchController.searchBar.text,
            @"eventCount": @(_nativeEventCount),
        });
    }
}

@end
